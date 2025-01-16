
/**
 * Remember to place your error in "err" and your result value in "result"
 */
const api = require("../../../common/ssb/api.js")
const lori = require("lori")

async function updateFollow(params, callback) {
  let err = false
  let result = false
  const identity = params[0]?.identity
  const feedId = params[0]?.feedId
  const desiredState = params[0]?.desiredState
  
  if (!feedId || !desiredState) {
    err = "Invalid feedId or desiredState."
  }
  
  if (!err) {
    try {
      result = await api.updateFollow(identity, feedId, !desiredState) // negation because original API reverses state.
      lori.debug(typeof result)
      lori.debug(JSON.stringify(result))
      lori.debug(result)
    } catch(n) {
      lori.debug(n)
      err =  `Error: ${n}`
    }
  }
  
  if (err) {
    callback(err, null)
  } else {
    callback(null, result)
  }
}

module.exports = updateFollow
