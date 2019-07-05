import { getPref, setPref } from "./utils.js"

export const getFilters = () => getPref("filters", [])

export const addFilter = (filter) => {
    let currentFilters = getFilters()

    currentFilters.push(filter)

    setPref("filters", currentFilters)
}

export const deleteFilter = (filter) => {
    let currentFilters = getFilters()

    setPref("filters", currentFilters.filter(f => f !== filter))
}

export const isMessageBlured = (msg) => {
    let currentFilters = getFilters().filter(f => f.action == "blur")
    let res = currentFilters.map((f) => isMessageFiltered(msg, f, "blur"))
    return res.some(r => r)
}

export const isMessageFiltered = (msg, filter, action) => {
    if (filter.action !== action) {
        return false
    }

    if (filter.expires) {
        let expirationDate = new Date(filter.expires)
        let today = new Date()

        if (today > expirationDate) {
            return false
        }
    }

    if (filter.feed == msg.value.author) {
        return true
    }

    if (filter.channel && msg.value.content.channel && filter.channel == msg.value.content.channel) {
        return true
    }

    if (filter.keywords.length > 0 && msg.value.content.type == "post" && msg.value.content.text) {
        let keywords = filter.keywords
        let content = msg.value.content.text.toLowerCase()

        let res  = keywords.map(k => content.includes(k.toLowerCase())).some(r => r)
        return res
    }

    // todo: change to use arrays, collect them all, answer with some()
   

    return false
}