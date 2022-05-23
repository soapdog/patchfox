const Stream = require("mithril/stream")

const { getPref } = require("./prefs.js")

const httpUrl = (url) => {
  let remote = ssb.remote
  let tildePos = remote.indexOf("~")
  let colonPos = remote.indexOf(":")
  let secondColonPos = remote.indexOf(":", 4)
  return "http" + remote.slice(colonPos, secondColonPos) + ":8989" + url
}

const blobUrl = (file) => {
  return httpUrl(`/blobs/get/${file}`)
}

const title = Stream()

const when = (value, vnode) => {
  if (value) {
    return vnode
  } else {
    return ""
  }
}

module.exports = {
  title,
  httpUrl,
  blobUrl,
  when
}
