/**
 * Prefs
 *
 * This is used to store preferences for Patchfox.
 */

const fs = require("fs")
const path = require("path")
const os = require("os")
const ssbKeys = require("ssb-keys")
const ssbRef = require("ssb-ref")
const TOML = require("@iarna/toml")
const prefsFile = path.join(os.homedir(), ".ssb", "patchfox.toml")
const ipcRenderer = require("electron").ipcRenderer

const defaultPreferencesContent = `
#
# DO NOT SHARE YOUR PREFERENCES FILE WITH ANYONE.
# IT CONTAINS YOUR PRIVATE KEYS.
#
[preferences]
theme = "light"
textSize = "prose-lg"
limit = "40"

[MessageTypes]
vote = "friends"
pub = "hide"
private = "hide"
channel = "friends"
post = "all"
blog = "all"
contact = "following"
about = "all"
gathering = "all"
`

let savedData = {}

const preferencesFileExists = () => {
  let fileExists = fs.existsSync(prefsFile)

  if (fileExists) {
    const data = TOML.parse(fs.readFileSync(prefsFile))
    console.log(data)
    if (data?.preferences?.defaultIdentity &&
      data[data?.preferences?.defaultIdentity]?.id) {
      return true
    }
  }

  return false
}

const initialisePreferencesFileIfNeeded = () => {
  if (!preferencesFileExists()) {
    fs.writeFileSync(prefsFile, defaultPreferencesContent)
    savedData = TOML.parse((defaultPreferencesContent))
  }
}

const loadSavedData = async () => {
  try {
    if (fs.existsSync(prefsFile)) {
      const data = TOML.parse(fs.readFileSync(prefsFile))

      if (data) {
        savedData = data
      } else {
        throw "Bad patchfox.toml"
      }

      return savedData
    }
    
  } catch (n) {
    console.log("deu treta!", n)
    throw "Configuration is missing"
  }
}

const getPref = (key, defaultValue) => {
  if (!savedData.hasOwnProperty("preferences")) {
    // maybe not loaded...
    // this happens when using the first time setup
    if (preferencesFileExists()) {
      savedData = TOML.parse(fs.readFileSync(prefsFile))
    }
  }

  if (savedData.preferences) {
    if (savedData.preferences.hasOwnProperty(key)) {
      return savedData.preferences[key]
    }
  }
  return defaultValue
}

function writePreferencesFile() {
  let header = `
#
# DO NOT SHARE YOUR PREFERENCES FILE WITH ANYONE.
# IT CONTAINS YOUR PRIVATE KEYS.
#  
  `
  let content = TOML.stringify(savedData)

  let data = `${header}\n${content}`
  fs.writeFileSync(prefsFile, data)

  ipcRenderer.send("preferences:reload")

}

const saveIdentityConfiguration = ({ keys, remote, type = "nodejs-db1", startServer = true }) => {
  const id = keys.id
  savedData[id] = {
    ...keys,
    remote,
    type,
    startServer
  }

  writePreferencesFile()
}

const removeIdentity = (key) => {

  if (savedData.hasOwnProperty(key)) {
    delete savedData[key]
  }

  writePreferencesFile()
}


const setPref = (key, value) => {
  savedData.preferences = savedData.preferences || {}
  savedData.preferences[key] = value

  writePreferencesFile()
}

const setMessageTypeVisibility = (type, value) => {
  savedData.MessageTypes = savedData.MessageTypes || {}
  savedData.MessageTypes[type] = value

  writePreferencesFile()
}

const getVisibilityForMessageType = (type, defaultValue = "hide") => {
  if (savedData.hasOwnProperty("MessageTypes")) {
    return savedData.MessageTypes[type] ?? defaultValue
  }

  return defaultValue
}

const savedIdentities = () => {
  let keys = Object.keys(savedData)

  keys = keys.filter(k => {
    return ssbRef.isFeed(k)
  })
  let arr = []

  // keys need to be reconstructed from TOML representation which is
  // flattened.
  arr = keys.map(k => {
    let temp = Object.assign({},savedData[k])
    let keys = {
      public: temp.public,
      private: temp.private,
      id: temp.id,
      curve: temp.curve
    }
    delete temp.public
    delete temp.private
    delete temp.id
    delete temp.curve

    temp.keys = keys

    return temp
  })
  return arr
}

const configurationForIdentity = (feedId) => {
  if (savedData[feedId]) {
    let temp = Object.assign({},savedData[feedId])
    let keys = {
      public: temp.public,
      private: temp.private,
      id: temp.id,
      curve: temp.curve
    }
    delete temp.public
    delete temp.private
    delete temp.id
    delete temp.curve

    temp.keys = keys

    return temp
  } else {
    return false
  }
}

const setDefaultIdentity = (feedId) => {
  setPref("defaultIdentity", feedId)
}

const getDefaultIdentity = () => {
  let id = getPref("defaultIdentity")
  if (id) {
    return configurationForIdentity(id)
  }

  let identities = savedIdentities()

  if (identities.length > 0) {
    setDefaultIdentity(identities[0].id)
    return identities[0]
  }

  throw "No default identity"
}

if (ipcRenderer) {
  ipcRenderer.on("preferences:reload", () => {
    console.log("Preferences changed on disk, reloading...")
    loadSavedData()
    patchfox.emit("preferences:changed")
  })
}

module.exports = {
  loadSavedData,
  setPref,
  getPref,
  saveIdentityConfiguration,
  configurationForIdentity,
  savedIdentities,
  getDefaultIdentity,
  setDefaultIdentity,
  removeIdentity,
  preferencesFileExists,
  initialisePreferencesFileIfNeeded,
  setMessageTypeVisibility,
  getVisibilityForMessageType,
}
