const view = require("./ErrorView.svelte")

patchfox.package({
  name: "errorHandler",
  supportedPlatforms: ["nodejs-ssb"],
  view,
})
