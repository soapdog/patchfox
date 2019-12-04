const Journal = require("./Journal.svelte")

patchfox.package({
    name: "journal",
    app: true,
    icon: "agenda.svg",
    view: Journal
})