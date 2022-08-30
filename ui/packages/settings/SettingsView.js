const m = require("mithril")
const Spinner = require("../../core/components/Spinner.js")
const DisplayPreferences = require("./DisplayPreferences.js")
const AboutView = require("./AboutView.js")

const menu = {
  "about": {
    label: "About Patchfox",
    panel: AboutView
  },
  "display": {
    label: "Display Preferences",
    panel: DisplayPreferences
  }
}


const StatusView = {
  oninit: (vnode) => {
    vnode.state.subView = vnode.attrs.subView ?? "display"
  },
  view: (vnode) => {

    let subView = vnode.state.subView

    return [
      m(".flex", [
        m("ul.menu.rounded-box.w-56.bg-base-100.", Object.keys(menu).map(k => m("li",{class: subView == k ? "bordered": ""}, m("a",{
          onclick: () => {
            vnode.state.subView = k
            m.redraw()
          }}, menu[k].label)))),
        m(".flex-auto.p-2", m(menu[subView].panel))
      ]),
    ]
  },
}

module.exports = StatusView
