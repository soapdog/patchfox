const core = require("./core/core.js")

let version = browser.runtime.getManifest().version
console.info(`Patchfox Version ${version}`)

core.start().then(() => {
  const packages = require("./packages/packages.js")
  const themes = require("./themes/themes.js")
  const WM = require("./wm.svelte")
  const wm = new WM({
    target: document.body,
  })
})
