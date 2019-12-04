const Vote = require("./Vote.svelte")

patchfox.package({
    name: "vote",
    messageTypes: [
        {
            type: "vote",
            card: Vote
        }
    ]
})