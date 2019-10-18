const { getPref, setPref } = require("../../kernel/prefs.js")

const getFilters = () => getPref("filters", [])

const addFilter = (filter) => {
    let currentFilters = getFilters()

    currentFilters.push(filter)

    setPref("filters", currentFilters)
}

const deleteFilter = (filter) => {
    let currentFilters = getFilters()

    setPref("filters", currentFilters.filter(f => f !== filter))
}

const isMessageBlured = (msg) => {
    let currentFilters = getFilters().filter(f => f.action == "blur")
    if (currentFilters.length > 0) {
        let res = currentFilters.map((f) => isMessageFiltered(msg, f, "blur"))
        return !res.some(r => r)
    } else {
        return false
    }
}


const isMessageHidden = (msg) => {
    let currentFilters = getFilters().filter(f => f.action == "hide")
    if (currentFilters.length > 0) {
        let res = currentFilters.map((f) => isMessageFiltered(msg, f, "hide"))
        return res.some(r => r)
    } else {
        return true // true because it is used by a pull.filter()
    }
}

const isMessageFiltered = (msg, filter, action) => {
    let filterResults = []
    if (filter.action !== action) {
        return true
    }

    if (filter.expires) {
        let expirationDate = new Date(filter.expires)
        let today = new Date()

        if (today > expirationDate) {
            return true
        }
    }

    if (filter.feed) {
        if (filter.feed == msg.value.author) {
            filterResults.push(true)
        } else {
            filterResults.push(false)
        }
    }

    if (filter.channel) {
        if (msg.value.content.channel && filter.channel == msg.value.content.channel) {
            filterResults.push(true)
        } else {
            filterResults.push(false)
        }
    }

    if (filter.keywords.length > 0 && msg.value.content.type == "post" && msg.value.content.text) {
        let keywords = filter.keywords
        let content = msg.value.content.text.toLowerCase()

        let res = keywords.map(k => content.includes(k.toLowerCase())).some(r => r)
        if (res) console.log("filtered due to keywords")
        filterResults.push(res)
    }

    return !filterResults.some(n => n == true)
}

module.exports = {
    getFilters,
    isMessageBlured,
    isMessageFiltered,
    isMessageHidden,
    addFilter,
    deleteFilter
}