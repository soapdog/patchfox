const Zine = require("./Zine.svelte")

patchfox.package({
  name: "zine",
  supportedPlatforms: ["nodejs-db1"],
  app: true,
  icon: "newspaper.svg",
  view: Zine,
})
