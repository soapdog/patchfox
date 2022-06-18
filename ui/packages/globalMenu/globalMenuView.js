const m = require("mithril")
const queryString = require("query-string")
const ipcRenderer = require("electron").ipcRenderer
const { when } = require("../../core/kernel/utils.js")
const ThemeSwitcher = require("../../core/components/ThemeSwitcher.js")

//const IdentitySwitcher = require("../../core/components/IdentitySwitcher.js")
//const ThemeSwitcher = require("../../core/components/ThemeSwitcher.js")

const GlobalMenuView = {
  oninit: (vnode) => {
    vnode.state.currentPackage = false

    patchfox.listen("package:changed", (event, pkg) => {
      vnode.state.currentPackage = pkg || false
      m.redraw()
    })

    let groups = patchfox.menuGroups()
    let groupKeys = Object.keys(groups)
    console.log("sending menu")
    ipcRenderer.send("menu:set", groups)
    ipcRenderer.on("menu:trigger", (event, data) => {
      patchfox.triggerMenu({ event: data.event, data: data.data })
    })
    ipcRenderer.on("window:focus", () => {
      ipcRenderer.send("set-menu", groups)
    })
  },
  view: (vnode) => {
    let currentQuery = queryString.parse(location.search)
    let title = patchfox.title()

    const menuItemToURL = ({ pkg, view, data }) => {
      let state = { pkg, view, ...data }
      if (currentQuery.identity) {
        state.identity = currentQuery.identity
      }
      let qs = queryString.stringify(state)
      return qs
    }

    let query = ""
    const search = (ev) => {
      patchfox.go("search", "query", { query })
    }

    if (vnode.state.currentPackage) {
      let windowTitle = `${vnode.state.currentPackage.packageToOpen.name}`

      if (
        vnode.state.currentPackage.view &&
        vnode.state.currentPackage.view.toLowerCase() !== "view"
      ) {
        windowTitle += ` > ${vnode.state.currentPackage.view}`
      }

      if (
        title.length > 0 &&
        title.toLowerCase() !== vnode.state.currentPackage.view.toLowerCase()
      ) {
        windowTitle += ` > ${title}`
      }

      ipcRenderer.send("window:set-title", windowTitle)

      window.title = windowTitle

      return m(".navbar.mb-2.bg-accent.rounded-box.text-accent-content", [
        m(".navbar-start", [
          m(
            "button.btn.btn-ghost",
            {
              onclick: () => history.back(),
            },
            m.trust("&larr;")
          ),
          m(
            "button.btn.btn-ghost",
            {
              onclick: () => location.reload(),
            },
            m.trust("&#8635;")
          ),
          m(
            "button.btn.btn-ghost",
            {
              onclick: () => history.forward(),
            },
            m.trust("&rarr;")
          ),
        ]),
        m(".navbar-center", [
          m(
            ".text-xl.breadcrumbs.capitalize",
            m("ul", [
              m("li", vnode.state.currentPackage.packageToOpen.name),
              when(
                vnode.state.currentPackage.view &&
                  vnode.state.currentPackage.view.toLowerCase() !== "view",
                m("li", vnode.state.currentPackage.view)
              ),
              when(
                title.length > 0 &&
                  title.toLowerCase() !==
                    vnode.state.currentPackage.view.toLowerCase(),
                m("li", title)
              ),
            ])
          ),
        ]),
        m(".navbar-end", [
          m(ThemeSwitcher)
        ])
      ])
    }
  },
}

module.exports = GlobalMenuView
