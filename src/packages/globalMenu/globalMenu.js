const view = require("./globalMenu.svelte");
require("./globalMenu.scss");

patchfox.package({
    name: "globalMenu",
    system: true,
    view,
    menu: [
        {
            label: "Help",
            event: "menu:help",
            subMenu: [
                {
                    label: "Documentation",
                    event: "menu:help:documentation"
                },
                {
                    label: "Troubleshooting",
                    event: "menu:help:troubleshooting"
                },
                {
                    label: "Release Notes",
                    event: "menu:help:release-notes"
                },
                {
                    kind: "separator"
                },
                {
                    label: "GitHub Issues"
                }
            ]
        }
    ]
});