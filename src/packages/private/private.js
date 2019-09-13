const Priv = require("./Private.svelte")

patchfox.package({
    name: "private",
    messageTypes: [
        {
            type: "private", // special type assigned by message handler
            card: Priv
        }
    ]
})