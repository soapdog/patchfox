/**
 * Prefs
 * 
 * This is used to store preferences for Patchfox. 
 */

let savedData = {}

const loadConfiguration = async () => {
    console.log("Loading configuration...")
    try {
        let data = await browser.storage.local.get()

        if (data.hasOwnProperty("keys")) {
            savedData = data
            return savedData
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


const setConnectionConfiguration = ({ keys, remote }) => {
    savedData.keys = keys
    savedData.remote = remote

    browser.storage.local.set(savedData)

}

const setPref = (key, value) => {
    savedData.preferences = savedData.preferences || {}
    savedData.preferences[key] = value

    browser.storage.local.set(savedData)
}

const savedKeys = () => {
    return savedData.keys
}

const remote = () => {
    return savedData.remote
}

const httpUrl = (url) => {
    let remote = savedData.remote
    let tildePos = remote.indexOf("~")
    let colonPos = remote.indexOf(":")
    return "http" + remote.slice(colonPos, tildePos) + url
}

module.exports = {
    loadConfiguration,
    setPref,
    getPref,
    setConnectionConfiguration,
    savedKeys,
    httpUrl,
    remote
}
