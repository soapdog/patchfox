const publicView = require("./Public.svelte");
const threadView = require("./Thread.svelte");

patchfox.package({
  name: "hub",
  public: publicView,
  thread: threadView,
  view: publicView,
  menu: {
    group: "Hub",
    label: "Feeds",
    items: [
      {
        label: "Public feed",
        event: "package:go",
        data: {
          pkg: "hub",
          view: "public"
        }
      }
    ]
  }
})
