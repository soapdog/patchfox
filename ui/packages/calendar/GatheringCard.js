const m = require("mithril")
const Card = require("../../core/components/Card.js")
const Scuttle = require("scuttle-gathering")
const gathering = Scuttle(ssb.sbot)
const { when } = require("../../core/kernel/utils.js")

const GatheringCard = {
  oninit: vnode => {
    let msg = vnode.attrs.msg

    vnode.state.event = false
    vnode.state.showRaw = false
    vnode.state.attending = []
    vnode.state.notAttending = []

    vnode.state.person = msg.value.author

    ssb.avatar(msg.value.author).then(data => {
      vnode.state.person = data.name
      m.redraw()
    })

    gathering.get(msg.key, (err, data) => {
      console.log(data)
      if (!err) {
        vnode.state.event = data
        vnode.state.attending = event.isAttendee
        vnode.state.notAttending = data.notAttendees.includes(ssb.feed)
      }
      m.redraw()
    })
  },
  view: vnode => {
    let msg = vnode.attrs.msg
    let showRaw = vnode.state.showRaw
    let event = vnode.state.event
    let msgid = msg.key

    const dateToNiceDate = epoch => {
      let date = new Date(epoch).toLocaleDateString()
      let time = new Date(epoch).toLocaleTimeString()
      return `${date} ${time}`
    }

    const attend = () => {
      gathering.attending(msgid, true, (err, data) => {
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

    if (!event) {
      return m(".loading")
    }

    return m(Card, {msg, showRaw, actions}, [
      m("h1.uppercase.font-medium", event.title),
      when(event.startDateTime, m("h2.uppercase", dateToNiceDate(event.startDateTime.epoch))),
      when(event.image, m("img.gathering-image", {
        src: patchfox.blobUrl(event.image.link),
        alt: event.image.name ?? "no description"
      })),
      m(".prose", m.trust(ssb.markdown(event.description)))
    ])
  },
}

module.exports = GatheringCard
