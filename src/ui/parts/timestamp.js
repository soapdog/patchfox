const timeago = require("timeago-simple")

const timestamp = t => {

    return timeago.simple(new Date(t))
}

module.exports = {timestamp}