const api = require("../../../common/ssb/api.js")
const lori = require("lori")

async function publicTimeline(params, callback) {
  const identity = params[0]?.identity
  let err = false
  let result = false

  try {
    result = await api.getThreads(identity, 2, 1)
  } catch(n) {
    lori.debug(n)
    err =  `Error: ${n}`
  }

  if (err) {
    callback(err, null)
  } else {
    callback(null, result)
  }
}

module.exports = publicTimeline
