
const caches = {}
const cacheResult = (kind, msgId, value) => {
  let key = `cache-${kind}-${msgId}`
  caches[key] = {
    time: Date.now(),
    value,
  }
}
const invalidateCacheResult = (kind, msgId) => {
  let key = `cache-${kind}-${msgId}`
  delete caches[key]
}

const resultFromCache = (kind, msgId, falseIfOlderThan) => {
  let key = `cache-${kind}-${msgId}`
  let currentDate = Date.now()
  if (caches.hasOwnProperty(key)) {
    let expiryDate = caches[key].time + falseIfOlderThan * 1000
    if (expiryDate > currentDate) {
      return caches[key].value
    }
  }
  // console.log("no cached result for", key)
  return false
}


const getMsgCache = (id) => {
  let data = sessionStorage.getItem(id)
  if (data) {
    try {
      return JSON.parse(data)
    } catch (n) {
      sessionStorage.removeItem(id)
      return false
    }
  } else {
    return false
  }
}

const setMsgCache = (id, data) => {
  sessionStorage.setItem(id, JSON.stringify(data))
}


module.exports = {
  caches,
  cacheResult,
  resultFromCache,
  invalidateCacheResult,
  getMsgCache,
  setMsgCache
}
