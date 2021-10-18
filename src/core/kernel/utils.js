const { writable } = require("svelte/store")
const { getPref } = require("./prefs.js")

const httpUrl = (url) => {
  let remote = ssb.remote
  let tildePos = remote.indexOf("~")
  let colonPos = remote.indexOf(":")
  return "http" + remote.slice(colonPos, tildePos) + url
}

const blobUrl = (file) => {
  return httpUrl(`/blobs/get/${file}`)
}

const _title = writable()

_title.subscribe(t => {
  window.title = `Patchfox - ${t}`
})

const title = t => {
  _title.set(t)
}

module.exports = {
  title,
  _title,
  httpUrl,
  blobUrl,
}
