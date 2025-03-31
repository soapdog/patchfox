const Pub = require("./Pub.svelte")

patchfox.package({
  name: "pub",
  supportedPlatforms: ["nodejs-ssb"],
  messageTypes: [
    {
      type: "pub",
      card: Pub
    }
  ]
})
