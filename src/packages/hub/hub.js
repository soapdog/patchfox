const publicView = require("./Public.svelte");
const threadView = require("./Thread.svelte");
const mentionsView = require("./Mentions.svelte");

patchfox.package({
  name: "hub",
  public: publicView,
  thread: threadView,
  mentions: mentionsView,
  view: publicView,
  menu: {
    group: "Hub",
    label: "Feeds",
    items: [
      {
        label: "Public",
        event: "package:go",
        data: {
          pkg: "hub",
          view: "public"
        }
      },
      {
        label: "Mentions",
        event: "package:go",
        data: {
          pkg: "hub",
          view: "mentions"
        }
      }
    ]
  }
})
