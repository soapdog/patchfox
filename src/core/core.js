const kernel = require("./kernel/kernel.js")
const platforms = require("./platforms/platforms.js")
const runtimes = require("./runtimes/runtimes.js")

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
    let server =  await ssb.connect()
    return server.id
  } catch (n) {
    switch (n) {
      case "Configuration is missing":
        // window.open("/docs/index.html#/troubleshooting/no-configuration")
        browser.runtime.openOptionsPage()
        break
      default:
        throw n
        break
    }
  }
}

module.exports = {
  start,
  platforms
}
