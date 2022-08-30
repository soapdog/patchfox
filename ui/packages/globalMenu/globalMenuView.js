const m = require("mithril")
const queryString = require("query-string")
const ipcRenderer = require("electron").ipcRenderer
const { when } = require("../../core/kernel/utils.js")
const ThemeSwitcher = require("../../core/components/ThemeSwitcher.js")

//const IdentitySwitcher = require("../../core/components/IdentitySwitcher.js")
//const ThemeSwitcher = require("../../core/components/ThemeSwitcher.js")

const GlobalMenuView = {
  oninit: vnode => {
    vnode.state.currentPackage = false

    patchfox.listen("package:changed", (event, pkg) => {
      vnode.state.currentPackage = pkg || false
      m.redraw()
    })

    let groups = patchfox.menuGroups()
    let groupKeys = Object.keys(groups)


    ipcRenderer.send("menu:set", groups)
    ipcRenderer.send("tray:set", patchfox.trayItems())

    ipcRenderer.on("menu:trigger", (event, data) => {
      patchfox.triggerMenu({ event: data.event, data: data.data })
    })
    ipcRenderer.on("window:focus", () => {
      ipcRenderer.send("set-menu", groups)
    })
  },
  view: vnode => {
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

    const makeButton = (label, pkg, view, data) => {
      return m(
        "a.btn.btn-sm.btn-ghost",
        {
          onclick: ev => {
            ev.preventDefault()
            patchfox.go(pkg, view, data)
          },
          href: patchfox.url(pkg, view, data),
        },
        label
      )
    }

    const search = ev => {
      let query = document.getElementById("search-box").value

      ev.preventDefault()
      patchfox.go("search", "query", { query })
    }

    if (vnode.state.currentPackage) {
      let windowTitle = `${vnode.state.currentPackage.packageToOpen.name}`

      if (vnode.state.currentPackage.view && vnode.state.currentPackage.view.toLowerCase() !== "view") {
        windowTitle += ` > ${vnode.state.currentPackage.view}`
      }

      if (title.length > 0 && title.toLowerCase() !== vnode.state.currentPackage.view.toLowerCase()) {
        windowTitle += ` > ${title}`
      }

      ipcRenderer.send("window:set-title", windowTitle)

      window.title = windowTitle

      return [
        m(".navbar.mb-2.bg-accent.sticky.top-0.left-0.right-0.w-full.z-50.h-9.min-h-8.text-accent-content", [
          m(".navbar-start", [
            m(
              "button.btn.btn-sm.btn-ghost",
              {
                onclick: () => history.back(),
              },
              m.trust("&larr;")
            ),
            m(
              "button.btn.btn-sm.btn-ghost",
              {
                onclick: () => location.reload(),
              },
              m.trust("&#8635;")
            ),
            m(
              "button.btn.btn-sm.btn-ghost",
              {
                onclick: () => history.forward(),
              },
              m.trust("&rarr;")
            ),
          ]),
          m(".navbar-center", [makeButton("Public", "hub", "public"), makeButton("Mentions", "hub", "mentions")]),
          m(".navbar-end", [
            m("form",{
              role: "search",
              onsubmit: search
            }, [
              m("input.input.input-bordered.input-sm.text-neutral", {
                type: "search",
                placeholder: "search...",
                name: "q",
                id: "search-box"
              })
            ]),
            m(ThemeSwitcher)
          ]),
        ]),
      ]
    }
  },
}

module.exports = GlobalMenuView
