const Scheme = require("./Scheme.svelte")

patchfox.package({
  name: "scheme",
  supportedPlatforms: ["nodejs-ssb"],
  app: true,
  icon: "icon.svg",
  view: Scheme,
})
