const PubView = require("./PubView.js")

patchfox.package({
  name: "pub",
  supportedPlatforms: ["nodejs-db1"],
  messageTypes: [
    {
      type: "pub",
      card: PubView
    }
  ]
})
