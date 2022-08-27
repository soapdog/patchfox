const SearchView = require("./SearchView.js")

patchfox.package({
  name: "search",
  supportedPlatforms: ["nodejs-db1"],
  view: SearchView,
  query: SearchView,
})
