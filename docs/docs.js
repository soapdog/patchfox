const path = require("path")

window.$docsify = {
  name: "Patchfox Help",
  repo: "soapdog/patchfox",
  basePath: typeof global !== "undefined" ? "/docs/" : path.join(__dirname, "docs/"),
  loadSidebar: true,
  coverpage: typeof global !== "undefined" ? false : true,
  subMaxLevel: 2
}
