const m = require("mithril")
const Spinner = require("../../core/components/Spinner.js")
const StatusView = {
  oninit: (vnode) => {
    vnode.state.shouldLoad = true
    vnode.state.status = ""
  },
  view: (vnode) => {
    if (vnode.state.shouldLoad) {
      ssb.system.getStatus().then((data) => {
        console.log("data", data)
        vnode.state.shouldLoad = false
        vnode.state.status = JSON.stringify(data, null, 4)
        m.redraw()
      })
    }

    if (vnode.state.shouldLoad) {
      return m(Spinner)
    } else {
      return [
        m("h1.title", "Status"),
        m("pre.container", m.trust(vnode.state.status)),
      ]
    }
  },
}

module.exports = StatusView
