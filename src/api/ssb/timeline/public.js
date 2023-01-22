const ssbRef = require("ssb-ref")
const serverForIdentity = require("../../../sbot.js")
const api = require("../../../common/ssb/api.js")

async function publicTimeline(params, callback) {
  console.log(params)
  const identity = params[0]?.identity
  let err = false
  let result = false

  if (!identity) {
    err = "Invalid identity."
  }

  if (!ssbRef.isFeed(identity)) {
    err = `Identity: ${identity} is not a valid identity`
  }

  if (!err) {
    try {
      result = await api.getThreads(identity, 1, 1)
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

module.exports = publicTimeline
