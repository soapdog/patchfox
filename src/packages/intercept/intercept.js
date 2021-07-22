const InterceptView = require("./InterceptView.svelte")

patchfox.package({
  name: "intercept",
  supportedPlatforms: ["all"],
  view: InterceptView
})
