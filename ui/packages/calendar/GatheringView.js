const m = require("mithril")
const Card = require("../../core/components/Card.js")
const Scuttle = require("scuttle-gathering")
const AvatarChip = require("../../core/components/AvatarChip.js")
const AvatarListing = require("../../core/components/AvatarListing.js")
const gathering = Scuttle(ssb.sbot)
const ics = require("ics")
const moment = require("moment")
const { timestamp } = require("../../core/components/timestamp.js")
const pull = require("pull-stream")
const paramap = require("pull-paramap")
const toPull = require("pull-promise")
const { when } = require("../../core/kernel/utils.js")

const GatheringView = {
  oninit: vnode => {
    let msgid = vnode.attrs.msgid
    vnode.state.event = false
    vnode.state.msg = false

    ssb.get(msgid).then(data => {
      vnode.state.msg = { value: data }
      vnode.state.feed = vnode.state.msg.value.author
      vnode.state.name = vnode.state.feed

      ssb.avatar(vnode.state.feed).then(data => {
        if (data.image !== null) {
          vnode.state.image = patchfox.blobUrl(data.image)
        }
        vnode.state.name = data.name
      })
    })

    gathering.get(msgid, (err, data) => {
      if (!err) {
        vnode.state.event = data
        vnode.state.attending = vnode.state.event.isAttendee
        vnode.state.notAttending = data.notAttendees.includes(ssb.feed)
        vnode.state.loadedAllData = true
        patchfox.title(vnode.state.event.title)
      }
    })
  },
  view: vnode => {
    let msgid = vnode.attrs.msgid
    let event = vnode.state.event
    let msg = vnode.state.msg
    let showRaw = vnode.state.showRaw

    const dateToNiceDate = epoch => {
      let date = new Date(epoch).toLocaleDateString()
      let time = new Date(epoch).toLocaleTimeString()
      return `${date} ${time}`
    }

    const attend = () => {
      gathering.attending(msgid, true, (err, data) => {
        console.log(err)
        console.log(data)
        if (!err) {
          vnode.state.attending = true
          vnode.state.notAttending = false
          m.redraw()
        }
      })
    }

    const notAttend = () => {
      gathering.attending(msgid, false, (err, data) => {
        if (!err) {
          vnode.state.notAttending = true
          vnode.state.attending = false
          m.redraw()
        }
      })
    }

    const exportToICS = ev => {
      pull(
        pull.values(event.attendees),
        paramap((attendee, cb) => {
          ssb.avatar(attendee).then(a => cb(null, { name: a.name, rsvp: true }))
        }),
        pull.collect((err, attendees) => {
          if (err) {
            console.log("err")
            throw err
          }
          let el = document.createElement("div")
          el.innerHTML = ssb.markdown(event.description)
          let obj = {
            title: event.title,
            description: el.innerText,
          }

          if (event.location) {
            obj.location = event.location
          }

          obj.start = moment(event.startDateTime.epoch).format("YYYY-M-D-H-m").split("-")

          obj.duration = { hours: 1 }
          obj.organizer = { name: name }
          obj.attendees = attendees

          let { error, value } = ics.createEvent(obj)

          if (error) {
            throw `Can't generate iCal ${error}`
          } else {
            let blob = new Blob([value], { type: "text/calendar" })

            const a = document.createElement("a")
            a.style.display = "none"
            document.body.appendChild(a)

            // Set the HREF to a Blob representation of the data to be downloaded
            a.href = window.URL.createObjectURL(blob)

            // Use download attribute to set set desired file name
            a.setAttribute("download", `${event.title}.ics`)

            // Trigger the download by simulating click
            a.click()

            // Cleanup
            window.URL.revokeObjectURL(a.href)
            document.body.removeChild(a)
          }
        })
      )
    }

    if (!event) {
      return m(".loading")
    }

    const actions = [
      m(".btn-group", [
        m("button.btn.btn-outline", {
          onclick: notAttend,
          class: vnode.state.notAttending ? "btn-active" : ""
        }, "Not Attending"),
        m("button.btn.btn-outline", {
          onclick: attend,
          class: vnode.state.attending ? "btn-active" : ""
        }, "Attending")
      ]),
      m("button.btn", {
        onclick: () => patchfox.go("calendar", "gathering", { msgid })
      }, "View Details")
    ]

    return m(Card, {msg, showRaw, actions}, [
      m("h1.uppercase.font-medium", event.title),
      when(event.startDateTime, m("h2.uppercase", dateToNiceDate(event.startDateTime.epoch))),
      event.hasOwnProperty("image") ? m("img.gathering-image", {
        src: patchfox.blobUrl(event.image.link),
        alt: event.image.name ?? "no description"
      }): "",
      m(".prose", m.trust(ssb.markdown(event.description))),
      m("h3.uppercase.font-medium.mt-4", "Attending"),
      event.attendees.map(f => m(AvatarChip, {feed: f})),
      m("h3.uppercase.font-medium.mt-4", "Not Attending"),
      event.notAttendees.map(f => m(AvatarChip, {feed: f}))
    ])
  },
}

module.exports = GatheringView
