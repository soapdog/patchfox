const m = require("mithril");
const queryString = require("query-string");


require("./menu.css");

class Menu {
    constructor() {
        this.groups = patchfox.menuGroups();
        this.groupKeys = Object.keys(this.groups);
        this.currentPackage = false;
        this.query = "";


        patchfox.listen("package:changed", (event, pkg) => {
            this.currentPackage = pkg.title || pkg.name || false;
        });
    }

    menuItemToURL({ pkg, view, data }) {
        let state = { pkg, view, ...data };
        let qs = queryString.stringify(state);
        return qs;
    };

    search(ev) {
        patchfox.go("search", "query", { query });
    };

    async openSidebar(ev) {
        let loc = window.location.href;
        browser.sidebarAction.setPanel({ panel: loc });
        browser.sidebarAction.open();
    };

    async closeSidebar(ev) {
        let loc = await browser.sidebarAction.getPanel({});
        await browser.tabs.create({ url: loc });
        await browser.sidebarAction.close();
    };

    sidebarToggle() {
        return m("a.btn.btn-link", { onclick: this.openSidebar }, [
            m("i.icon.icon-arrow-left")
        ])
    }

    searchBox() {
        return m("form", { onsubmit: this.search }, [
            m(".input-group.input-inline.p-2", [
                m("input.form-input[type=text]", { placeholder: "Search" }),
                m("button.btn.btn-primary.input-group-btn", { onclick: this.search }, "Search")
            ])
        ])
    }

    navigation() {
        return this.groupKeys.map(gk => {
            return m(".dropdown", [
                m("a.btn.btn-link.dropdown-toggle", { tabindex: 0, href: "#" }, [gk, m("i.icon.icon-caret")]),
                m("ul.menu", this.groups[gk].map(menu => {
                    let content = []
                    if (menu.label) {
                        content.push(m(`li.divider[data-content=${menu.label}]`))
                    }
                    menu.items.forEach(item => {
                        content.push(
                            m("li.menu-item.text-left",
                                m("a.btn.btn-link", {
                                    href: `?${this.menuItemToURL(item.data)}`,
                                    onclick: (ev) => {
                                        ev.preventDefault()
                                        patchfox.triggerMenu(item)
                                    }
                                }, item.label)
                            ))
                    })
                    return content
                }))
            ])
        })

    }

    sidebarMenu() {

    }

    mainMenu() {
        return m("header.main-menu.navbar.hide-sm", [
            m("section.navbar-section", [
                this.sidebarToggle(),
                ...this.navigation()
            ]),
            m("section.navbar-section", [
                this.searchBox()
            ])
        ])
    }

    view() {
        return m(".container", [
            this.mainMenu(),
            this.sidebarMenu()
        ])
    }
}

module.exports = Menu