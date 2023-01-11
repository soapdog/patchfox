const lori = require("lori")

function shutdown(_useless, callback) {
    lori.warn("Received shutdown method call")
    callback(null, true)
    process.kill(process.pid, "SIGTERM")
}

module.exports = shutdown
