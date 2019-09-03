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
        console.log("saved data",data)

        if (data.hasOwnProperty("keys")) {
            savedData = data
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


const setConnectionConfiguration = ({ keys, remote, manifest }) => {
    savedData.keys = keys
    savedData.remote = remote
    savedData.manifest = manifest

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

module.exports = {
    loadConfiguration,
    setPref,
    getPref,
    setConnectionConfiguration,
    savedKeys
}