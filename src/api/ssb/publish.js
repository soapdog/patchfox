/**
 * Remember to place your error in "err" and your result value in "result"
 */
const api = require("../../common/ssb/api.js")
const lori = require("lori")
  
async function publish(params, callback) {
  const identity = params[0]?.identity
  const ssb = serverForIdentity(identity)
  const payload = params[0]?.payload
  const type = params[0]?.type
  
  let err = false
  let result = false
  
  if (!payload) {
    err = "Invalid payload."
  }
  
  if (!type) {
    err = "Invalid type."
  }
  
  if (err) {
    callbacl(null, err)
    return false
  }
  
  try {
    ssb.db.publish(
      {
        timestamp: Date.now(),
        author: ssb.id,
        type,
        ...payload,
      },
      (err, result) => {
        if (err) {
          return reject(err);
        }
        callback(result, null)

      }
    )
  } catch (err) {
    callback(err, null)
  }
}

module.exports = publish
