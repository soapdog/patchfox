const Pub = require("./Pub.svelte")

patchfox.package({
  name: "pub",
  messageTypes: [
    {
      type: "pub",
      card: Pub
    }
  ]
})
