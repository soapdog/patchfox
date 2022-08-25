const m = require("mithril")
const { when } = require("../../core/kernel/utils.js")
const _ = require("lodash")
const pull = require("pull-stream")
const Abortable = require("pull-abortable")
const { onDestroy, tick } = require("svelte")
const paramap = require("pull-paramap")
const sort = require("pull-sort")
const Scuttle = require("scuttle-gathering")
const gathering = Scuttle(ssb.sbot)
const sbot = ssb.sbot

const TimelineView = {
  oninit: vnode => {
    vnode.state.loading = true
    vnode.state.abortable = null
    vnode.state.gatherings = []

    let currentDate = new Date().getTime()

    if (ssb.platform === "nodejs-ssb") {
      console.time("loading gatherings")
      pull(
        sbot.messagesByType({
          type: "gathering",
          gt: (currentDate / 1000) | 0,
          // lt: (twoYearsFromNow.getTime() / 1000) | 0
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
          let twoYearsFromNow = new Date()
          twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2)
          return event.startDateTime.epoch > currentDate && event.startDateTime.epoch < twoYearsFromNow.getTime()
        }),
        sort((e1, e2) => {
          if (e1.startDateTime.epoch == e2.startDateTime.epoch) {
            return 0
          }

          if (e1.startDateTime.epoch > e2.startDateTime.epoch) {
            return 1
          }

          return -1
        }),
        pull.collect((err, events) => {
          let groups = _.groupBy(events, event => {
            let date = new Date(event.startDateTime.epoch)
            return date.toISOString().slice(0, 7)
          })
          let keys = Object.keys(groups)

          vnode.state.gatherings = keys.map(k => {
            return { name: k, events: groups[k] }
          })

          vnode.state.loading = false
          console.timeEnd("loading gatherings")
          console.log("gatherings", vnode.state.gatherings)
          m.redraw()
        })
      )
    }
  },
  onbeforeremove: vnode => {
    if (vnode.state.abortable) {
      vnode.state.abortable()
    }
  },
  view: vnode => {
    let loading = vnode.state.loading
    let abortable = vnode.state.abortable
    let gatherings = vnode.state.gatherings

    const dateToNiceDate = epoch => {
      let date = new Date(epoch).toLocaleDateString()
      let time = new Date(epoch).toLocaleTimeString()
      return `${date} ${time}`
    }

    const monthAndYear = s => {
      let str = `${s}-01T12:00:00`
      let date = new Date(str)
      console.log("str", str)
      console.log("date", date)
      return date.toLocaleDateString("en-GB", { year: "numeric", month: "long" })
    }

    // bounty: the query used to find future events might be incomplete.

    const loadingMessage = [m.trust(ssb.markdown("This query shows future events up to two years from now. It might take a while, go grab some :coffee: or :tea: ...")), m(".loading")]

    const todayLabel = m("li.step.[data-content='']", `Today: ${dateToNiceDate(new Date())}`)

    const makeGathering = group => [
      m("li.step.step-info",{"data-content": ""}, m("h2.uppercase.text-medium", monthAndYear(group.name))),
      group.events.map(event =>
        m("li.step",{"data-content": ""}, m("span", [
          event.title,
          when(event.startDateTime, m("span.ml-2.badge.badge-outline", dateToNiceDate(event.startDateTime.epoch))),
          m("a.btn.btn-sm.ml-2", {
            href: patchfox.url("calendar", "gathering", { msgid: event.key }),
            onclick: ev => {
              ev.preventDefault()
              patchfox.go("calendar", "gathering", { msgid: event.key })
            },
          }, "View gathering"),
        ]))
      ),
    ]

    const timeline = m("ul.steps.steps-vertical", [todayLabel, gatherings.map(makeGathering)])

    return m(".events-display", [vnode.state.loading ? loadingMessage : timeline])
  },
}

module.exports = TimelineView
