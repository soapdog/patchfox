const VoteView = require("./VoteView.js")

patchfox.package({
  name: "vote",
  supportedPlatforms: ["nodejs-db1"],
  messageTypes: [
    {
      type: "vote",
      card: VoteView,
      short: true,
    },
  ],
})
