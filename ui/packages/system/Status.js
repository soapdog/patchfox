const m = require("mithril")
const Spinner = require("../../core/components/Spinner.js")

const fetchAndUpdateStatus = vnode => {
  ssb.system.getStatus().then((data) => {
    vnode.state.status = data
    m.redraw()
    vnode.state.flag = setTimeout(() => fetchAndUpdateStatus(vnode), 2000)
  })
}

const StatusView = {
  oninit: (vnode) => {
    vnode.state.status = false
    vnode.state.rebuilding = false

    vnode.state.flag = setTimeout(() => fetchAndUpdateStatus(vnode), 1000)
  },
  onbeforeremove: vnode => {
    clearTimeout(vnode.state.flag)
  },
  view: (vnode) => {
    const rebuildIndexes = () => {
      vnode.state.rebuilding = true
      ssb.sbot.rebuild((err, data) => {
        console.log("err", err)
        console.log("data", data)
        vnode.state.rebuilding = false
        m.redraw()
      })
    }


    if (!vnode.state.status) {
      return m(Spinner)
    } else {
      let status = vnode.state.status
      // progress
      delete status.progress.ooo // not really a value for progress bars.
      let progressKeys = Object.keys(status.progress)

      let progressElements = progressKeys.map(k => {
        let label = k
        let curr = status.progress[k].current
        let goal = status.progress[k].target

        return m("div.flex", [
          m("span.uppercase.pr-2.flex-auto", label),
          m("progress.progress.flex-none.w-56", {
            value: curr,
            max: goal,
            class: curr == goal ? "progress-success" : ""
          })
        ])
      })

      // plugins
      let pluginsSync = status.sync
      let syncGoal = pluginsSync.since

      const makeProgress = (label) => {
        let curr = pluginsSync.plugins[label]
        let goal = syncGoal

        return m("div.flex", [
          m("span.uppercase.pr-2.flex-auto", label),
          m("progress.progress.flex-none.w-56", {
            value: curr,
            max: goal,
            class: curr == goal ? "progress-success" : ""
          })
        ])
      }

      return [
        m(".navbar.bg-neutral",[
          m(".flex-none.text-neutral-content", `Up to: ${status.sync.since}`),
          vnode.state.rebuilding ? m("div.flex-1.text-neutral-content.place-content-center", [
            m(Spinner),
          ]) : m(".flex-1"),
          m("button.btn.btn-warning", {
            onclick: rebuildIndexes
          }, "Rebuild indexes")
        ]),

        m(".flex", [
          m("div.p-2.flex-auto", [
            m("h1.text-xl.uppercase", "Progress"),
            m("div.mb-4", [
              progressElements
            ]),
          ]),
          m("div.p-2.flex-auto", [
            m("h1.text-xl.uppercase", "Plugins"),
            m("div.mb-4", [
              Object.keys(pluginsSync.plugins).map(k => makeProgress(k))
            ])
          ])
        ])
      ]
    }
  },
}

module.exports = StatusView
