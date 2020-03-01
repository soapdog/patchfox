const { getPref, setPref } = require("../../kernel/prefs.js")
const _ = require("lodash")

const getFilters = () => getPref("filters", [])

const addFilter = (filter) => {
    let currentFilters = getFilters()

    filter.action = filter.action || "hide"
    filter.feed = filter.feed || false
    filter.channel = filter.channel || false
    filter.keywords = filter.keywords || false;
    filter.expires = filter.expires || false;

    currentFilters.push(filter)

    setPref("filters", currentFilters)
}

const deleteFilter = (filter) => {
    let currentFilters = getFilters()

    setPref("filters", currentFilters.filter(f => {
        let keys = Object.keys(filter)
        let include = false
        keys.forEach(k => {
            if (filter[k] !== f[k]) include = true
        })
        return include
    }))
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

const isChannelFiltered = (channel) => {
    let currentFilters = getFilters().filter(f => f.action == "hide")
    if (currentFilters.length > 0) {
        let res = currentFilters.map((filter) => {
            if (channel && channel.startsWith("#")) {
                channel = channel.slice(1);
            }

            if (filter.expires) {
                let expirationDate = new Date(filter.expires)
                let today = new Date()
        
                if (today > expirationDate) {
                    return true
                }
            }

            if (channel == filter.channel) {
                return false
            }

            return true
        })

        return !res.some(r => r)
    } else {
        return false
    }
}


const isMessageHidden = (msg) => {
    let currentFilters = getFilters().filter(f => f.action == "hide")
    if (currentFilters.length > 0) {
        let res = currentFilters.map((f) => isMessageFiltered(msg, f, "hide"))
        res = !res.some(r => !r)
        return res
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
    isChannelFiltered,
    addFilter,
    deleteFilter
}
