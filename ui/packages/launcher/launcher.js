const LauncherView  = require("./LauncherView.js")

patchfox.package({
  name: "launcher",
  supportedPlatforms: ["all"],
  description: "A handy application/package launcher.",
  system: true,
  view: LauncherView,
  menu: {
    group: "Patchfox",
    items: [
      {
        label: "Launcher",
        event: "launcher:open",
        data: {},
      },
    ],
  },
})
