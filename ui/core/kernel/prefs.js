/**
 * Prefs
 *
 * This is used to store preferences for Patchfox.
 */

const fs = require("fs")
const path = require("path")
const os = require("os")
const ssbKeys = require("ssb-keys")

let savedData = {}

const loadSavedData = async () => {
  try {
    const keys = ssbKeys.loadOrCreateSync(path.join(os.homedir(), ".ssb", "secret"))
    
    let data = JSON.parse(localStorage.getItem("data"))

    if (data && data.hasOwnProperty("identities")) {
      savedData = data
    } else if (!keys) {
      throw "Configuration is missing"
    }
    
    if (!savedData.hasOwnProperty("identities")) {
      savedData.identities = {}
    }
    
    if (!savedData.identities.hasOwnProperty(keys.public)) {
      let remote = `net:127.0.0.1:8008~shs:${keys.id.slice(1, keys.id.indexOf("=") + 1)}`
      if (fs.existsSync(path.join(os.homedir(), ".ssb", "socket"))) {
        let socketPath = path.join(os.homedir(), ".ssb", "socket")
        let key = keys.id.slice(1, keys.id.indexOf("=") + 1)
        // remote = `unix:${socketPath}:~noauth:${key}`
      }
      savedData.identities[keys.public] = {
          keys,
          remote,
          type: "nodejs-db1"
      }
    }
        
    return savedData
    
  } catch (n) {
    console.log("deu treta!", n)
    throw "Configuration is missing"
  }
}

const getPref = (key, defaultValue) => {
  if (savedData.preferences) {
    if (savedData.preferences.hasOwnProperty(key)) {
      return savedData.preferences[key]
    }
  }
  return defaultValue
}

const saveIdentityConfiguration = ({ keys, remote, type }) => {
  const publicKey = keys.public
  savedData.identities = savedData.identities || {}
  savedData.identities[publicKey] = {
    keys,
    remote,
    type,
  }

  localStorage.setItem("data", JSON.stringify(savedData))
}

const removeIdentity = (key) => {
  savedData.identities = savedData.identities || {}

  if (savedData.identities.hasOwnProperty(key)) {
    delete savedData.identities[key]
  }

  localStorage.setItem("data", JSON.stringify(savedData))
}


const setPref = (key, value) => {
  savedData.preferences = savedData.preferences || {}
  savedData.preferences[key] = value

  localStorage.setItem("data", JSON.stringify(savedData))
}

const savedIdentitites = () => {
  return savedData.identities
}

const configurationForIdentity = (feedId) => {
  if (savedData?.identities?.[feedId]) {
    return savedData.identities[feedId]
  } else {
    return false
  }
}

const setDefaultIdentity = (feedId) => {
  savedData.defaultIdentity = feedId

  localStorage.setItem("data", JSON.stringify(savedData))
}

const getDefaultIdentity = () => {
  if (savedData?.defaultIdentity) {
    return configurationForIdentity(savedData.defaultIdentity)
  }

  if (savedData.hasOwnProperty("identities")) {
    return savedData?.identities[Object.keys(savedData?.identities)[0]]
  }

  throw "Configuration is missing"
}

module.exports = {
  loadSavedData,
  setPref,
  getPref,
  saveIdentityConfiguration,
  configurationForIdentity,
  savedIdentitites,
  getDefaultIdentity,
  setDefaultIdentity,
  removeIdentity,
}
