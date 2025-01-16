
/**
 * Remember to place your error in "err" and your result value in "result"
 */
const api = require("../../../common/ssb/api.js")
const lori = require("lori")

async function update(params, callback) {
  let err = false
  let result = false
  const identity = params[0]?.identity
  const updates = params[0] || false
  
  if (!identity) {
    err = "Invalid identity."
  }
  
  if (!updates) {
    err = "Invalid updates."
  }
  
  if (updates.identity) {
    delete updates.identity
  }
  
  if (!err) {
    try {
      result = await api.updateProfile(identity, updates) // negation because original API reverses state.
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

module.exports = update
