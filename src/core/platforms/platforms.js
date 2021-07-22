const { NodeJsSSB } = require("./nodejs-ssb/ssb.js")

const platforms = {
  "nodejs-ssb": NodeJsSSB,
}
global.ssb = new platforms["nodejs-ssb"]()
module.exports = platforms
