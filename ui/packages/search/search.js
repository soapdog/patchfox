const SearchView = require("./SearchView.js")

patchfox.package({
  name: "search",
  supportedPlatforms: ["nodejs-ssb"],
  view: SearchView,
  query: SearchView,
})
