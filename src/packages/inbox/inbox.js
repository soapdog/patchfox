const Inbox = require("./Inbox.svelte")

patchfox.package({
  name: "inbox",
  supportedPlatforms: ["nodejs-ssb"],
  app: true,
  icon: "agenda.svg",
  view: Inbox,
  menu: {
    group: "Hub",
    items: [
      {
        label: "Private",
        event: "package:go",
        data: {
          pkg: "inbox",
          view: "view",
        },
      },
    ]
  }
})
