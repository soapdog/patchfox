const GlobalMenuView = require("./globalMenuView.js")

patchfox.package({
  name: "globalMenu",
  supportedPlatforms: ["all"],
  system: true,
  view: GlobalMenuView
})
