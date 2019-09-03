const view = require("./globalMenu.svelte");
require("./globalMenu.scss");

patchfox.package({
    name: "globalMenu",
    system: true,
    view
});