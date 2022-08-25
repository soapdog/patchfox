const PrivateCard = require("./PrivateCard.js")

patchfox.package({
  name: "private",
  supportedPlatforms: ["nodejs-ssb"],
  messageTypes: [
    {
      type: "private", // special type assigned by message handler
      card: PrivateCard,
    },
  ],
})
