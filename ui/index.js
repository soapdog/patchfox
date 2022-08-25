const m = require("mithril")
const core = require("./core/core.js")
const themes = require("./themes/themes.js")
const Wm = require("./wm.js")

let version = require("../package.json").version
console.info(`Patchfox Version ${version}`)
console.info(`Electron ${process.versions.electron} Chrome ${process.versions.chrome}`)

core.start().then(() => {
  m.mount(document.body, Wm)
})

