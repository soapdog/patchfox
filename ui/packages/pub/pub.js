const PubView = require("./PubView.js")

patchfox.package({
  name: "pub",
  supportedPlatforms: ["nodejs-ssb"],
  messageTypes: [
    {
      type: "pub",
      card: PubView
    }
  ]
})
