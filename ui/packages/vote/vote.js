const VoteView = require("./VoteView.js")

patchfox.package({
  name: "vote",
  supportedPlatforms: ["nodejs-ssb"],
  messageTypes: [
    {
      type: "vote",
      card: VoteView,
      short: true,
    },
  ],
})
