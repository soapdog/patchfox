const StatusBarView = require("./statusBarView.js")

patchfox.package({
  name: "statusBar",
  supportedPlatforms: ["all"],
  system: true,
  view: StatusBarView
})
