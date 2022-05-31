const ErrorView = require("./ErrorView.js")

patchfox.package({
  name: "errorHandler",
  supportedPlatforms: ["all"],
  view: ErrorView,
})
