const Priv = require("./Private.svelte")

patchfox.package({
  name: "private",
  supportedPlatforms: ["nodejs-ssb"],
  messageTypes: [
    {
      type: "private", // special type assigned by message handler
      card: Priv,
    },
  ],
})
