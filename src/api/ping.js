const lori = require("lori")

function ping(_useless, callback) {
    callback(null, "pong")
}

module.exports = ping
