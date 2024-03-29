const version = require("../../../package.json").version
const path = require("path")
const releaseNotesUrl = path.join(`/release_notes/${version}`)

patchfox.package({
  name: "helpMenu",
  supportedPlatforms: ["all"],
  menu: [
    {
      group: "Help",
      items: [
        {
          label: "Documentation",
          event: "documentation:open",
          data: "",
        },
        {
          label: "Troubleshooting",
          event: "documentation:open",
          data: "/troubleshooting/",
        },
        {
          label: "Release Notes",
          event: "documentation:open",
          data: releaseNotesUrl,
        },
      ],
    },
  ],
  tray: [
    {
      label: "Documentation",
      event: "documentation:open",
      data: "",
    },
    {
      label: "Troubleshooting",
      event: "documentation:open",
      data: "/troubleshooting/",
    },
    {
      label: "Release Notes",
      event: "documentation:open",
      data: releaseNotesUrl,
    },
  ]
})
