const Settings = require("./settings.js");

patchfox.package({
    name: "settings",
    title: "Settings",
    icon: "icon.svg",
    view: Settings,
    menu: {
        group: "Patchfox",
        label: "Settings",
        items: [{
                label: "Settings",
                event: "package:go",
                data: { pkg: "settings" }
            },
            {
                label: "Display Preferences",
                event: "package:go",
                data: { pkg: "settings", data: { subView: "displayPreferences" } }
            },
            {
                label: "Filters",
                event: "package:go",
                data: { pkg: "settings", data: { subView: "filters" } }
            }

        ]
    }
});