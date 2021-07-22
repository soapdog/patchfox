
const httpUrl = (url) => {
  let remote = ssb.remote
  let tildePos = remote.indexOf("~")
  let colonPos = remote.indexOf(":")
  return "http" + remote.slice(colonPos, tildePos) + url
}

const blobUrl = (file) => {
  return httpUrl(`/blobs/get/${file}`)
}

module.exports = {
  httpUrl,
  blobUrl
}
