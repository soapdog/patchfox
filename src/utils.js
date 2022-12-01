const jaysonBrowserClient = require("jayson/lib/client/browser")
const fetchUrl = require("fetch").fetchUrl

// from: https://www.npmjs.com/package/jayson
function collapse(stem, sep, obj) {
  return function (map, key) {
    const prop = stem ? stem + sep + key : key
    const value = obj[key]
    if (typeof value === "function") map[prop] = value
    else if (typeof value === "object" && value !== null) map = Object.keys(value).reduce(collapse(prop, sep, value), map)
    return map
  }
}

function methodsToJaysonServerConfiguration(methods) {
  const map = Object.keys(methods).reduce(collapse("", ".", methods), {})
  return map
}

function JsonRPCClientWithToken(url, token) {
  const callServer = function (request, callback) {
    const options = {
      method: "POST",
      payload: request,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }

    fetchUrl(url, options, (error, meta, body) => {
      if (error) {
        callback(error, null)
      } else {
        let b = body.toString()
        callback(null, b)
      }
    })
  }

  const client = new jaysonBrowserClient(callServer, {
    // other options go here
  })

  return client
}

module.exports = {
  methodsToJaysonServerConfiguration,
  JsonRPCClientWithToken,
}
