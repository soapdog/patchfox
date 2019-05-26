/**
 * COMPONENT "PUBLIC VIEW"
 * 
 * OBJECTIVE:
 * Provide a public view of your feed.
 * 
 * This is a Mithril.
 */

import { getMessageComponent } from "./messages/message.js"

export class PublicView {
    constructor() {
        this.msgs = []
        this.limit = 10
    }

    oninit(vnode) {
        let comp = vnode.attrs.comp || false 
        let msg = vnode.attrs.key || false
        let options = { limit: this.limit, reverse: true };


        if (comp && msg) {
            options[comp] = msg
        }

        ssb.public(options)
            .then((data) => {
                console.log("go msgs")
                if (data !== this.msgs) {
                    this.msgs = data
                    m.redraw() 
                }
            })
    }

    oncreate(vnode) {
        console.log("create!")
    }

    async fetchNext() {
        let lastMsg = this.msgs[this.msgs.length - 1]
        m.route.set("/public/:comp/:msg", {comp: "lt", msg: lastMsg.rts})
        console.log("fetchnext")
    }

    async fetchPrevious() {
        let firstMsg = this.msgs[0]
        this.msgs = await ssb.public({ limit: this.limit, reverse: true, gt: firstMsg.rts })
        console.log("fetchmore", this.msgs)
        m.redraw()
        window.scrollTo(0, 0)
    }

    view(vnode) {
        let lastMsg = false 
        let firstMsg = false
        if (this.msgs.length > 0) {
            lastMsg = this.msgs[this.msgs.length - 1]
            firstMsg = this.msgs[0]
        }

        console.log("view")
        return m("div", [
            m("h1", "Public"),
            m("div.is-message-thread", [
                this.msgs.map(msg => {
                    let key = msg.key
                    return m(getMessageComponent(msg), { key, msg })
                })
            ]),
            (lastMsg && firstMsg) ?
                m("ul.pagination", [
                    m("div.page-item.page-prev",
                        m("a[href=/public]", {
                            oncreate: m.route.link
                        }, m("div.page-item-title.h5", "Newer"))),
                    m("div.page-item.page-next",
                        m(`a[href=/public/lt/${lastMsg.rts}]`, {
                            oncreate: m.route.link
                        }, m("div.page-item-title.h5", "Older")))
                ]) :
                m("p", "loading...")
        ])
    }
}
