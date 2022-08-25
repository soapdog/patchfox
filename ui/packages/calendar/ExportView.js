const m = require("mithril")
const _ = require("lodash")
const pull = require("pull-stream")
const Abortable = require("pull-abortable")
const paramap = require("pull-paramap")
const sort = require("pull-sort")
const Scuttle = require("scuttle-gathering")
const ics = require("ics")
const gathering = Scuttle(ssb.sbot)
const sbot = ssb.sbot

const ExportView = {
  oninit: vnode => {
    vnode.state.loading = true
    vnode.state.events = []
    vnode.state.abortable = () => {}
    vnode.state.groupedEvents = []
  },
  onbeforeremove: vnode => {
    vnode.state.abortable()
  },
  view: vnode => {
    let loading = vnode.state.loading
    let events = vnode.state.events
    let groupedEvents = vnode.state.groupedEvents

    console.time("loading gatherings")

    let currentDate = new Date().getTime()

    pull(
      sbot.messagesByType({
        type: "gathering",
        gt: (currentDate / 1000) | 0,
      }),
      (vnode.state.abortable = Abortable()),
      pull.filter(function (msg) {
        return msg && msg.value && msg.value.content && msg.value.content.type === "gathering"
      }),
      paramap((msg, cb) => {
        gathering.get(msg.key, (err, data) => {
          msg.event = data
          cb(null, msg)
        })
      }),
      pull.map("event"),
      pull.filter(event => {
        if (!event.startDateTime) {
          return false
        }
        return event.startDateTime.epoch > currentDate
      }),
      pull.filter(e => e.isAttendee),
      sort((e1, e2) => {
        if (e1.startDateTime.epoch == e2.startDateTime.epoch) {
          return 0
        }

        if (e1.startDateTime.epoch > e2.startDateTime.epoch) {
          return 1
        }

        return -1
      }),
      pull.collect((err, gs) => {
        vnode.state.$ltevents = gs
        let groups = _.groupBy(gs, event => {
          let date = new Date(event.startDateTime.epoch)
          return date.toISOString().slice(0, 7)
        })
        let keys = Object.keys(groups)

        vnode.state.groupedEvents = keys.map(k => {
          return { name: k, events: groups[k] }
        })

        vnode.state.loading = false
        console.timeEnd("loading gatherings")
      })
    )

    const dateToNiceDate = epoch => {
      let date = new Date(epoch).toLocaleDateString()
      let time = new Date(epoch).toLocaleTimeString()
      return `${date} ${time}`
    }

    const monthAndYear = s => {
      let str = `${s}-01`
      let date = new Date(str)
      return date.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
      })
    }

    const getEventAttendees = e => {
      let attendeesP = e.attendees.map(async id => {
        let feed = await ssb.avatar(id)
        return { name: feed.name, rsvp: true }
      })
      let notAttendeesP = e.notAttendees.map(async id => {
        let feed = await ssb.avatar(id)
        return { name: feed.name, rsvp: false }
      })

      return Promise.all(attendeesP.concat(notAttendeesP))
    }
    // fixme: all of this is broken

    const gatheringToEventObj = async e => {
      let attendees = await getEventAttendees(e)

      let obj = {
        title: e.title,
        description: e.description,
      }

      if (e.location) {
        obj.location = e.location
      }

      if (e.attendees) {
        obj.attendees = attendees
      }
      console.log(obj)
      return obj
    }

    const exportToICS = () => {
      let ee = events.map(e => gatheringToEventObj(e))
      console.log(ee)
      Promise.all(ee, es => {
        console.log("es", es)
        const { error, value } = ics.createEvents(es)

        if (error) {
          console.log(error)
        }

        console.log(value)
      })
    }

    const loadingView = [
      m.trust(ssb.markdown("This query might take a while, go grab some :coffee: or :tea: ...")),
      m(".loading")
    ]

    const eventsView = [
      m("h1.h1", "Export Future Events"),
      m("p", "There are the future events you're attending. You can:"),
      m("button.btn", {onclick: exportToICS}, "Export as iCal file")
      // todo: implement the rest
    ]

    return m(".events-display", vnode.state.loading ? loadingView : eventsView)
  },
}

module.exports = ExportView
