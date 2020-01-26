const m = require("mithril")

require("./MenuItem.css")

class MenuItem {
    view(vnode) {
        let label = vnode.attrs.label
        let icon = vnode.attrs.icon
        let link = vnode.attrs.link

        return m("li.menu-item",
            m("a", {
                href: link,
                target: "_blank"
            }, [
                icon ? m(`i.icon.icon-${icon}`) : "",
                m(label)
            ]))
    }
}

module.exports = MenuItem