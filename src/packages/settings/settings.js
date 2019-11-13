const view = require("./Settings.svelte");

patchfox.package({
  name: "settings",
  title: "Settings",
  icon: "icon.svg",
  view,
  menu: {
    group: "Patchfox",
    items: [
      {
        label: "Settings",
        event: "package:go",
        data: {pkg: "settings"}
      }
    ]
  }
});
