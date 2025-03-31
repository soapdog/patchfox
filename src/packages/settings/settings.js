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
        label: "Settings",
        event: "package:go",
        data: { pkg: "settings" },
      },
      {
        label: "Filters",
        event: "package:go",
        data: { pkg: "settings", data: { subView: "filters" } },
      },
    ],
  },
})
