const Journal = require("./Journal.svelte")



patchfox.package({
  name: "journal",
  supportedPlatforms: ["nodejs-db1"],
  app: true,
  icon: "agenda.svg",
  view: Journal,
})
