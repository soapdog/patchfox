const api = require("../../common/ssb/api.js")
const lori = require("lori")


async function newPost(params, callback) {
  const identity = params[0]?.identity
  const content = params[0]?.content
  let err = false
  let result = false

  if (!content || !content?.text) {
    err = "Invalid content."
  }

  if (!err) {
    try {
      result = await api.postMessage(identity, content)
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

module.exports = newPost
