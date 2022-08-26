import SettingsView from "./SettingsView.js"

patchfox.package({
  name: "settings",
  supportedPlatforms: ["all"],
  title: "Settings",
  icon: "icon.svg",
  view: SettingsView,
  menu: {
    group: "Application",
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
