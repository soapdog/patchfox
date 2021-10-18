const view = require("./Settings.svelte")

patchfox.package({
  name: "settings",
  supportedPlatforms: ["all"],
  title: "Settings",
  icon: "icon.svg",
  view,
  menu: {
    group: "Patchfox",
    label: "Settings",
    items: [
      {
        label: "Identity & Connection",
        event: "package:go",
        data: { pkg: "settings", data: { subView: "identityAndConnection" } },
      },
      {
        label: "Display Preferences",
        event: "package:go",
        data: { pkg: "settings", data: { subView: "displayPreferences" } },
      },
      {
        label: "Filters",
        event: "package:go",
        data: { pkg: "settings", data: { subView: "filters" } },
      },
    ],
  },
})
