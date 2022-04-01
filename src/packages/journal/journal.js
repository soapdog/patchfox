const Journal = require("./Journal.svelte")



patchfox.package({
  name: "journal",
  supportedPlatforms: ["nodejs-ssb"],
  app: true,
  icon: "agenda.svg",
  view: Journal,
})
