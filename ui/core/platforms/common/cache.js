const HLRU = require("hashlru")
const rootCache = HLRU(200) 

const caches = {}
let avatarCache = {}

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
  if (rootCache.has(id)) {
    return rootCache.get(id)
  } else {
    return false
  }
}

const setMsgCache = (id, data) => {
  rootCache.set(id, data)
}

function setAvatarCache(feed, data) {
  avatarCache[feed] = data
  localStorage.setItem(`profile-${feed}`,JSON.stringify(data))
  return data
}

function getCachedAvatar(feed) {
  if (avatarCache[feed]) {
    return avatarCache[feed]
  } else {
    return JSON.parse(localStorage.getItem(`profile-${feed}`))
  }
}

function getAllCachedUsers() {
  return avatarCache
}

async function loadCaches() {
  console.time("avatar cache")
  let allSavedData = { ...localStorage }
  delete allSavedData["/.ssb/secret"]
  let keys = Object.keys(allSavedData)
  keys.forEach((k) => {
    let key = k.replace("profile-", "")
    try {
      avatarCache[key] = JSON.parse(allSavedData[k])
    } catch (n) {
      localStorage.removeItem(`profile-${k}`)
    }
  })

  console.timeEnd("avatar cache")
  console.log(`cached ${Object.keys(avatarCache).length} users`)
}


module.exports = {
  caches,
  cacheResult,
  resultFromCache,
  invalidateCacheResult,
  getMsgCache,
  setMsgCache,
  setAvatarCache,
  getCachedAvatar,
  getAllCachedUsers,
  loadCaches
}
