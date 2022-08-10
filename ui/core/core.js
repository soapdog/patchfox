const kernel = require("./kernel/kernel.js")
const runtimes = require("./runtimes/runtimes.js")
const queryString = require("query-string")
const { isMessageHidden } = require("./platforms/common/abusePrevention.js")
const path = require("path")

const {setServerType} = require("./platforms/platforms.js")

global.patchfox = {}
Object.assign(global.patchfox, kernel)
Object.assign(global.patchfox, runtimes)

const start = async () => {
  let qs = queryString.parse(location.search)

  try {
    let savedData = await kernel.loadSavedData()
    
    let identity = qs?.identity ? kernel.configurationForIdentity(qs.identity) : kernel.getDefaultIdentity() 
    console.info(`key: ${identity.keys.public}, remote: ${identity.remote}`)
    setServerType(identity.type) // sets global.ssb to be the correct platform.
    
    let server = await ssb.connect(identity.keys, identity.remote)
    global.ssb.remote = identity.remote
    global.ssb.feed = server.id
    global.ssb.sbot = server
    
    ssb.setGetPrefFunction(kernel.getPref)
    ssb.setIsMessageHiddenFunction(isMessageHidden)
    
    await ssb.loadCaches()
    
    require("../packages/packages.js")
    
    console.log("até aqui nos ajudou o Senhor...")
    
    return server.id
    
  } catch (n) {
    console.log("problem in core", JSON.stringify(n))
    let pkg = qs.pkg
    if (pkg !== "settings") {
      switch (n) {
      case "Configuration is missing":
        window.open(path.join(__dirname, "../../docs/index.html#/troubleshooting/no-configuration"))
        break
      case "could not connect to sbot":
        window.open(path.join(__dirname, "../../docs/index.html#/troubleshooting/no-connection"))
        break
      default:
        console.error("Exception not caught", n)
        throw n
      }
    } else {
      console.error("error on core start", n)
      //throw n
    }
  }
}

module.exports = {
  start
}
