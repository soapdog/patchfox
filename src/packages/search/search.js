const SearchView = require("./SearchView.svelte")

patchfox.package({
  name: "search",
  supportedPlatforms: ["nodejs-ssb"],
  view: SearchView,
  query: SearchView,
})
