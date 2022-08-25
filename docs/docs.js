const path = require("path")

console.log("dirname", __dirname)
console.log("global", global)

global.$docsify = {
  name: "Patchfox Help",
  repo: "soapdog/patchfox",
  basePath: typeof global == "undefined" ? "/docs/" : path.join(__dirname),
  loadSidebar: true,
  coverpage: typeof global !== "undefined" ? false : true,
  subMaxLevel: 2
}
