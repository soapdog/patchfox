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
                    event: "url:open",
                    data: "/docs/index.html"
                },
                {
                    label: "Troubleshooting",
                    event: "url:open",
                    data: "/docs/index.html#/troubleshooting/"
                },
                {
                    label: "Release Notes",
                    event: "url:open",
                    data: "/docs/index.html#/release_notes/latest"
                },
                {
                    kind: "separator"
                },
                {
                    label: "GitHub Issues",
                    event: "url:open",
                    data: "https://github.com/soapdog/patchfox/issues"
                }
            ]
        }
    ]
});