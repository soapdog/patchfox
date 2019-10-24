const kernel = require("./kernel/kernel.js")
const platforms = require("./platforms/platforms.js")
const runtimes = require("./runtimes/runtimes.js")
const queryString = require("query-string")


if (window) {
  window.patchfox = {}
  Object.assign(window.patchfox, kernel)
  Object.assign(window.patchfox, platforms)
  Object.assign(window.patchfox, runtimes)
}

const start = async () => {
  try {
    await kernel.loadConfiguration()
    window.ssb = new platforms.SSB()
    let server = await ssb.connect()
    window.ssb.feed = server.id
    window.ssb.sbot = server
    await ssb.loadCaches()
    return server.id
  } catch (n) {
    let qs = queryString.parse(location.search);
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
          break
      }
    }
  }
}

module.exports = {
  start,
  platforms
}
