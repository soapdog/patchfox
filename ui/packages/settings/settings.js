import view from "./Settings.svelte"

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
        label: "Identities & Connections",
        event: "package:go",
        data: { pkg: "settings", data: { subView: "identitiesAndConnections" } },
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
