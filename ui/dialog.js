const m = require("mithril")
const core = require("./core/core.js")
const themes = require("./themes/themes.js")
const queryString = require("query-string")
const { getPref } = require("./core/kernel/prefs")

let version = require("../package.json").version
console.info(`Patchfox Version ${version}`)
console.info(`Electron ${process.versions.electron} Chrome ${process.versions.chrome}`)

const Wrapper = {
  oninit: (vnode) => {
    try {
      const currentTheme = getPref("theme", "light")
      document.documentElement.setAttribute("data-theme", currentTheme)

      let qs = queryString.parse(location.search)
      let pkg = qs.pkg
      let view = qs.view ? qs.view : "view"
      delete qs.pkg
      delete qs.view

      let packageToOpen = patchfox.packages[pkg]

      vnode.state.currentView = packageToOpen[view]
      vnode.state.args = qs ?? {}
      vnode.state.key = new Date()

      console.log(vnode.state.args)
    }catch (e) {
      console.error("problem in init", e)
    }
  },
  view: (vnode) => {
    console.log("vnode", vnode.state)
    try {
      let view = vnode.state.currentView
      let key = vnode.state.key
      let args = vnode.state.args

      console.log("view called!")
      return m("div.bg-base-200.min-h-screen",
        m("div.root.mx-auto.text-base-content.pb-4", [
          m(".container.wm-current-app-container.container.mx-auto", m(view, { key, ...args }))
        ])
      )
    }catch (e) {
      console.error("prblem in view", e)
    }
  }
}

/**
 * Dialogs differ a bit from normal Patchfox windows. They:
 * - Will not auto-start a sbot client.
 * - Will use a "chromeless" window.
 * - Will not load all packages.
 */
core.start({connectClient: false}).then(() => {
  console.log("Core started, attempting to mount wrapper")
  m.mount(document.body, Wrapper)
})

