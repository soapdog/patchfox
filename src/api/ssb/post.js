const ssbRef = require("ssb-ref")
const serverForIdentity = require("../../sbot.js")
const api = require("../../common/ssb/api.js")

async function post(params, callback) {
  console.log(params)
  const identity = params[0]?.identity
  const content = params[0]?.content
  let err = false
  let result = false

  if (!identity) {
    err = "Invalid identity."
  }

  if (!content || !content?.text) {
    err = "Invalid content."
  }

  if (!ssbRef.isFeed(identity)) {
    err = `Identity: ${identity} is not a valid identity`
  }

  if (!err) {
    try {
      result = await api.postMessage(identity, content)
      console.log(typeof result)
      console.log(JSON.stringify(result))
      console.log(result)
    } catch(n) {
      console.log(n)
      err =  `Error: ${n}`
    }
  }

  if (err) {
    callback(err, null)
  } else {
    callback(null, result)
  }
}

module.exports = post
