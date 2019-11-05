const view = require("./launcher.svelte");

patchfox.package({
    name: "launcher",
    description: "A handy application/package launcher.",
    system: true,
    view
})