const view = require("./globalMenu.svelte");

patchfox.package({
  name: "globalMenu",
  supportedPlatforms: ["nodejs-ssb"],
  system: true,
  view
});
