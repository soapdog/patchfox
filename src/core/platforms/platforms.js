const { NodeJsSSB } = require("./nodejs-ssb/ssb.js")
const { GoSSB } = require("./go-ssb/ssb.js")


const platforms = {
  "nodejs-ssb": NodeJsSSB,
  "go-ssb": GoSSB,
}

const setServerType = (serverType = "nodejs-ssb", keys, remote) => {
  global.ssb = new platforms[serverType]()
}

global.setServerType = setServerType

module.exports = platforms
