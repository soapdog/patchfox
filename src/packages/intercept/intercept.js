const InterceptView = require("./InterceptView.svelte")

patchfox.package({
  name: "intercept",
  supportedPlatforms: ["nodejs-ssb"],
  view: InterceptView
})
