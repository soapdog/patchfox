const m = require("mithril");

class Card {

    view(vnode) {
        return m("div.card.m-2", [
            vnode.attrs.image ? m(".card-image", vnode.attrs.image) : "",
            vnode.attrs.header ? m(".card-header", vnode.attrs.header) : "",
            m(".card-body", vnode.children),
            vnode.attrs.footer ? m(".card-footer", vnode.attrs.footer) : ""
        ])
    }
}

module.exports = Card