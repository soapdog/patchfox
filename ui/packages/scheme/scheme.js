const Scheme = require("./Scheme.svelte")

patchfox.package({
  name: "scheme",
  supportedPlatforms: ["nodejs-db1"],
  app: true,
  icon: "icon.svg",
  view: Scheme,
})
