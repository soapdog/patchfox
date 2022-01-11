/**
 * Prefs
 *
 * This is used to store preferences for Patchfox.
 */

let savedData = {}

const loadSavedData = async () => {
  try {
    let data = await browser.storage.local.get()

    if (data.hasOwnProperty("identities")) {
      savedData = data
      return savedData
    } else if (data.hasOwnProperty("keys")) {
      let tempKeys = data.keys
      let tempRemote = data.remote 
      savedData = {
        [tempKeys.public]: {
          keys: tempKeys,
          remote: tempRemote,
          type: "nodejs-ssb"
        }
      }
    } else {
      throw "Configuration is missing"
    }
  } catch (n) {
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

  browser.storage.local.set(savedData)
}


const setPref = (key, value) => {
  savedData.preferences = savedData.preferences || {}
  savedData.preferences[key] = value

  browser.storage.local.set(savedData)
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

  browser.storage.local.set(savedData)
}

const getDefaultIdentity = () => {
  if (savedData?.defaultIdentity) {
    return configurationForIdentity(savedData.defaultIdentity)
  } else {
    savedData?.identities[Object.keys(savedData?.identities)[0]]
  }
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
}
