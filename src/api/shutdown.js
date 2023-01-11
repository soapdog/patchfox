const lori = require("lori")

function shutdown(_useless, callback) {
    lori.warn("Received shutdown method call")
    for (id in global._ssbServers) {
      lori.info(`Stopping SSB server for ${id}...`)
      const s = global._ssbServers[id]

      s.close()

      lori.info(`Stopped SSB server for ${id}.`)
      delete global._ssbServers[id]
    }
    callback(null, true)
    process.kill(process.pid, "SIGTERM")
}

module.exports = shutdown
