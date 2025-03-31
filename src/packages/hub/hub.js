const publicView = require("./Public.svelte")
const threadView = require("./Thread.svelte")
const mentionsView = require("./Mentions.svelte")
const channelView = require("./Channel.svelte")
const channelCard = require("./ChannelCard.svelte")
const popularView = require("./Popular.svelte")

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
