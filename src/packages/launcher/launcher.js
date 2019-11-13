const view = require("./launcher.svelte");

patchfox.package({
    name: "launcher",
    description: "A handy application/package launcher.",
    system: true,
    view,
    menu: {
        group: "Patchfox",
        items: [
          {
            label: "Launcher",
            event: "launcher:open",
            data: {}
          }
        ]
      }
})