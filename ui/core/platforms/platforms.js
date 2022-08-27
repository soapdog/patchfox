const { NodeJsDB1 } = require("./nodejs-db1/ssb.js")

//const { GoSSB } = require("./go-ssb/ssb.js")
//const { BrowserSSB } = require("./browser-ssb/ssb.js")


const platforms = {
  "nodejs-db1": NodeJsDB1,
//  "go-ssb": GoSSB,
//  "browser-ssb": BrowserSSB
}

const setServerType = (serverType = "nodejs-db1", keys, remote) => {
  if (platforms.hasOwnProperty(serverType)) {
    global.ssb = new platforms[serverType]()
  } else {
    throw `unknown server type: ${serverType}`
  }
}

global.setServerType = setServerType

module.exports = {
  platforms,
  setServerType
}
