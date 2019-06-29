import { getPref, setPref } from "./utils.js"

export const getFilters = () => getPref("filters", [])

export const setFilter = (filter) => {
    let currentFilters = getFilters()

    currentFilters.push(filter)

    setPref("filters", currentFilters)
}

export const deleteFilter = (filter) => {
    let currentFilters = getFilters()

    setPref("filters", currentFilters.filter(f => f == filter))
}