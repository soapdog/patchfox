const m = require("mithril")
const MenuItem = require("./ui/MenuItem.js")

require("./MessageDropdown.css")

class MessageDropdown {
    constructor() {
        this.dropdownActive = false
        this.showRaw = false
    }

    copyPermalink() {
        navigator.clipboard
            .writeText(`ssb:${msg.key}`)
            .then(() => console.log("permalink copied"))
            .catch(err => console.error("can't copy permalink", err))

        this.dropdownActive = false
    };

    copyHash() {
        navigator.clipboard
            .writeText(`${msg.key}`)
            .then(() => console.log("hash copied"))
            .catch(err => console.error("can't copy hash", err))

        this.dropdownActive = false
    };

    view(vnode) {
        return m(".dropdown", [
            m("span.btn.btn-link.dropdown-toggle", {
                tabindex: 0,
                class: this.dropdownActive ? "active" : "",
                onclick: () => this.dropdownActive = !this.dropdownActive
            }, m("i.icon.icon-more-vert")),
            m("ul.menu.menu-right", [
                m(MenuItem, {
                    label: "Open In New Tab",
                    icon: "share",
                    link: "?pkg=hub&view=thread&thread={encodeURIComponent(msg.key)}"
                }),
                m(MenuItem, {
                    label: "Copy permalink to clipboard",
                    icon: "copy",
                    onclick: () => this.copyPermalink()
                }),
                m(MenuItem, {
                    label: "Copy message id to clipboard",
                    icon: "copy",
                    onclick: () => this.copyHash()
                }),
                m("li.divider[data-content=FOR THE CURIOUS"),
                m(MenuItem, {
                    label: "Raw Message",
                    icon: "message",
                    onclick: () => this.attrs.toggleRawMessage()
                })
            ])
        ])
    }
}

module.exports = MessageDropdown