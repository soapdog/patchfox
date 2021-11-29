const kernel = require("./kernel/kernel.js")
const runtimes = require("./runtimes/runtimes.js")
const queryString = require("query-string")
const { isMessageHidden } = require("./platforms/nodejs-ssb/abusePrevention.js")


if (window) {
  window.patchfox = {}
  Object.assign(window.patchfox, kernel)
  Object.assign(window.patchfox, runtimes)
}

const start = async () => {
  let qs = queryString.parse(location.search)

  try {
    let savedData = await kernel.loadSavedData()
    // window.ssb.* comes from browserified ssb.js
    // that exists only in the dist folder.
    let identity = qs?.identity ? kernel.configurationForIdentity(qs.identity) : kernel.getDefaultIdentity() 
    console.info(`server: ${identity.type}, key: ${identity.keys.public}`)
    setServerType(identity.type)
    let server = await ssb.connect(identity.keys, identity.remote)
    window.ssb.remote = identity.remote
    window.ssb.feed = server.id
    window.ssb.sbot = server
    ssb.setGetPrefFunction(kernel.getPref)
    ssb.setIsMessageHiddenFunction(isMessageHidden)
    await ssb.loadCaches()
    return server.id
  } catch (n) {
    let pkg = qs.pkg
    if (pkg !== "settings") {
      switch (n) {
      case "Configuration is missing":
        location = "/docs/index.html#/troubleshooting/no-configuration"
        break
      case "can't connect to sbot":
        location = "/docs/index.html#/troubleshooting/no-connection"
        break
      default:
        throw n
      }
    } else {
      console.error("error on core start", n)
      throw n
    }
  }
}

module.exports = {
  start
}
