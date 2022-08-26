const SettingsView = require("./SettingsView.js")

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
        label: "Settings",
        event: "package:go",
        data: { pkg: "settings"},
      }
    ],
  },
})
