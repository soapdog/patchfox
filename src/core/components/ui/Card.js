const m = require("mithril");

class Card {

    view(vnode) {
        let image = []

        if (this.image) {
            image.push(this.image)
        }

        let header = []

        if (this.header) {
            header.push(this.header)
        }

        let footer = []

        if (this.footer) {
            footer.push(this.footer)
        }

        return m("div.card.m-2", [
            ...image,
            ...header,
            vnode.children,
            ...footer
        ])
    }
}

module.exports = Card