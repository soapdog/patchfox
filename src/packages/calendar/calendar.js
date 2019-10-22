const GatheringCard = require("./GatheringCard.svelte")

patchfox.package({
    name: "calendar",
    messageTypes: [
        {
            type: "gathering",
            card: GatheringCard
        }
    ]
})