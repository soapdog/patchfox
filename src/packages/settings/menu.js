const m = require("mithril");

class Menu {
    constructor(vnode) {
        this.subView = vnode.attrs.subView
    }

    menuItem(id, label) {
        return m("li.menu-item",
            m("a", {
                href: "#/settings",
                onclick: () => {
                    this.subView(id)

                },
                class: this.subView() === id ? "active" : ""
            }, label))
    }
    view(vnode) {
        return m("ul.menu", [
            m("li.divider[data-content=GENERAL]"),
            this.menuItem("about", "About Patchfox"),
            this.menuItem("identityAndConnection", "Identity And Connection"),
            this.menuItem("displayPreferences", "Display Preferences"),
            m("li.divider[data-content=ABUSE PREVENTION]"),
            this.menuItem("filters", "Filters"),
            this.menuItem("contentWarnings", "Content Warnings"),

        ])
    }
}

module.exports = Menu