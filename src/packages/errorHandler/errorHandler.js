const view = require("./ErrorView.svelte")

patchfox.package({
  name: "errorHandler",
  supportedPlatforms: ["all"],
  view,
})
