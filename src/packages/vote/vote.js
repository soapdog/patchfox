const Vote = require("./Vote.svelte")

patchfox.package({
  name: "vote",
  supportedPlatforms: ["nodejs-ssb"],
  messageTypes: [
    {
      type: "vote",
      card: Vote,
      short: true,
    },
  ],
})
