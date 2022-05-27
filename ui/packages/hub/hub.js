const publicView = require("./Public.js")
const threadView = require("./Thread.js")
const mentionsView = require("./Mentions.js")
const channelView = require("./Channel.js")
const channelCard = require("./ChannelCard.js")
const popularView = require("./Popular.js")

patchfox.package({
  name: "hub",
  supportedPlatforms: ["nodejs-ssb"],
  public: publicView,
  thread: threadView,
  mentions: mentionsView,
  view: publicView,
  channel: channelView,
  popular: popularView,
  messageTypes: [
    {
      type: "channel",
      card: channelCard,
      short: true,
    },
  ],
  menu: {
    group: "Hub",
    label: "Feeds",
    items: [
      {
        label: "Popular",
        event: "package:go",
        data: {
          pkg: "hub",
          view: "popular",
        },
      },
      {
        label: "Public",
        event: "package:go",
        data: {
          pkg: "hub",
          view: "public",
        },
      },
      {
        label: "Mentions",
        event: "package:go",
        data: {
          pkg: "hub",
          view: "mentions",
        },
      },
    ],
  },
})