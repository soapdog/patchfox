const version = require("../../../package.json").version
const path = require("path")
const releaseNotesUrl = path.join(__dirname, `../../../docs/index.html#/release_notes/${version}`)

patchfox.package({
  name: "helpMenu",
  supportedPlatforms: ["all"],
  menu: [
    {
      group: "Help",
      items: [
        {
          label: "Documentation",
          event: "url:open",
          data: "/docs/index.html",
        },
        {
          label: "Troubleshooting",
          event: "url:open",
          data: "/docs/index.html#/troubleshooting/",
        },
        {
          label: "Release Notes",
          event: "url:open",
          data: releaseNotesUrl,
        },
      ],
    },
  ],
})
