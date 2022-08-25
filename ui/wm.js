const m = require("mithril")
const _ = require("lodash")
const { getPref } = require("./core/kernel/prefs.js")
const queryString = require("query-string")
const path = require("path")

let useShortColumn = true
let currentView = false
let currentPackage = false
let args = {}
let key = Date.now()

patchfox.listen("package:changed", (event, data) => {
  console.log(`package changed to "${data.packageToOpen.name}.${data.view}"`)
})

const goPackage = ({ pkg, view, data }) => {
  try {
    let packageToOpen = patchfox.packages[pkg]
    let viewToOpen = view ? packageToOpen[view] : packageToOpen.view
    let eventToSend = view ? `package:activate:${pkg}:${view}` : `package:activate:${pkg}:view`

    currentView = false
    args = {}
    patchfox.title("") // just clear the title store before loading new package.

    // normal package
    if (packageToOpen && viewToOpen) {
      args = data
      currentPackage = packageToOpen
      currentView = viewToOpen
      patchfox.emit("package:changed", { packageToOpen, view: view || "view", data })
      patchfox.emit(eventToSend, data)
      return true
    }
  } catch (e) {
    throw `Can't go to package ${pkg} and view ${view}`
  }
}

const popState = ev => {
  console.log("pop!", ev.state)
  if (ev.state !== null) {
    goPackage(ev.state)
    m.redraw()
  }
}

const handleUncaughtException = (message, source, lineno, colno, error) => {
  console.log("error happened!", message)
  goPackage({
    pkg: "errorHandler",
    data: {
      currentPackage,
      message,
      source,
      lineno,
      colno,
      error
    },
  })
  m.redraw()
  return true
}

patchfox.listen("package:go", (event, { pkg, view, data }) => {
  if (typeof data === "undefined") {
    data = {}
  }
  let cs = queryString.parse(location.search)
  let state = { pkg, view, ...data }
  if (cs.identity) {
    state.identity = cs.identity
  }
  let qs = queryString.stringify(state)
  history.pushState({ pkg, view, data }, "", path.join(__dirname, `/index.html?${qs}`))
  console.log(`going to ${pkg}.${view} with args`, data)
  goPackage({ pkg, view, data })
  key = Date.now()
  m.redraw()
  window.scrollTo(0,0)
})

patchfox.listen("package:save:state", (event, { pkg, view, data }) => {
  if (typeof data === "undefined") {
    data = {}
  }

  let state = { pkg, view, ...data }
  let qs = queryString.stringify(state)
  history.pushState({ pkg, view, data }, "", `index.html?${qs}`)
})

window.onerror = handleUncaughtException
window.onpopstate = popState

const Wm = {
  oninit: (vnode) => {
    const currentTheme = patchfox.getPref("theme", "light")
    document.documentElement.setAttribute("data-theme", currentTheme)
    
    let qs = queryString.parse(location.search)
    let pkg = qs.pkg || getPref("default-package", "hub")
    let view = qs.view ? qs.view : "view"
    delete qs.pkg
    delete qs.view
    patchfox.go(pkg, view, qs)
  },
  view: (vnode) => {
    let systemPackages = patchfox.systemPackages()
    return m("div.bg-base-200.min-h-screen", 
      m("div.root.mx-auto.text-base-content.pb-4",[
        // system packages
        ...systemPackages.map(pkg => m(pkg.view)),
        // app package or current package
        currentPackage?.app ? m(".container.wm-current-app-container.container.mx-auto", m(currentView, {key, ...args})) :
          m(".wm-current-package-container.p-2", m(".wm-current-package", m(currentView, {key, ...args}))),
        m("div", {style: {height: "40px"}})
      ])
    )
  }
}

module.exports = Wm
