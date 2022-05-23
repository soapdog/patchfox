const Zine = require("./Zine.svelte")

patchfox.package({
  name: "zine",
  supportedPlatforms: ["nodejs-ssb"],
  app: true,
  icon: "newspaper.svg",
  view: Zine,
})
