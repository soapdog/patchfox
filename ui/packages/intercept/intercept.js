const InterceptView = require("./InterceptView.js")

patchfox.package({
  name: "intercept",
  supportedPlatforms: ["all"],
  view: InterceptView
})
