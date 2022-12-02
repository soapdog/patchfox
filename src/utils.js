const jaysonBrowserClient = require("jayson/lib/client/browser")
const fetchUrl = require("fetch").fetchUrl
const requireGlob = require('require-glob')
const lori = require("lori")


function collectMethods() {
  const methods = collapseNamespaces(requireGlob.sync(['api/**/*.js']))
  console.log("methods", methods)
}

function collectMethodsForXMLRPC(xmlrpc) {
  const rawMethods = collapseNamespaces(requireGlob.sync(['api/**/*.js']))

  const methods = {} 
  Object.keys(rawMethods).forEach(k => {
    let old = rawMethods[k]
    methods[k] = function xmlrpcHandler(req, res) {
      old(req.body.params, (err, result)=>{
        if (err) {
          lori.error(`${k} --> ${err.message}`)
          res.send(xmlrpc.serializeFault(err.code, err.message))
        } else {
          lori.debug(`${k} --> ${result}`)
          res.send(xmlrpc.serializeResponse(result))
        }
      })
    }
  })
  return methods
}

function collectMethodsForJSONRPC(xmlrpc) {
  const methods = collapseNamespaces(requireGlob.sync(['api/**/*.js']))

  return methods
}

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

function collapseNamespaces(methods) {
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
  collapseNamespaces,
  JsonRPCClientWithToken,
  collectMethodsForXMLRPC,
  collectMethodsForJSONRPC
}
