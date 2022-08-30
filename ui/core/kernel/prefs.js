/**
 * Prefs
 *
 * This is used to store preferences for Patchfox.
 */

const fs = require("fs")
const path = require("path")
const os = require("os")
const ssbKeys = require("ssb-keys")
const TOML = require('@iarna/toml')
const prefsFile = path.join(os.homedir(), ".ssb", "patchfox.toml")

let savedData = {}

const preferencesFileExists = () => fs.existsSync(prefsFile)

const loadSavedData = async () => {
  try {
    const keys = ssbKeys.loadOrCreateSync(path.join(os.homedir(), ".ssb", "secret"))
    
    if (fs.existsSync(prefsFile)) {
      let data = TOML.parse(fs.readFileSync(prefsFile))

      if (data && data.hasOwnProperty("identities")) {
        savedData = data
      }
    }
    
    if (!keys) {
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

      fs.writeFileSync(prefsFile, TOML.stringify(savedData))

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

  fs.writeFileSync(prefsFile, TOML.stringify(savedData))
}

const removeIdentity = (key) => {
  savedData.identities = savedData.identities || {}

  if (savedData.identities.hasOwnProperty(key)) {
    delete savedData.identities[key]
  }

  fs.writeFileSync(prefsFile, TOML.stringify(savedData))
}


const setPref = (key, value) => {
  savedData.preferences = savedData.preferences || {}
  savedData.preferences[key] = value

  // localStorage.setItem("data", JSON.stringify(savedData))
  fs.writeFileSync(prefsFile, TOML.stringify(savedData))
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

  fs.writeFileSync(prefsFile, TOML.stringify(savedData))
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
  preferencesFileExists,
}
