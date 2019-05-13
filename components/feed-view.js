/**
 * COMPONENT "PUBLIC VIEW"
 * 
 * OBJECTIVE:
 * Provide a public view of your feed.
 * 
 * This is a Mithril.
 */

import { getMessageComponent } from "./messages/message.js"

export class FeedView {
    constructor() {
        this.msgs = []
    }

    async oninit() {
        this.msgs = await ssb.public({limit: 10, reverse: true})
        console.log(this.msgs)
        m.redraw()
    }

    view(vnode) {
        return m("div", [
            m("h1", `Feed:${vnode.attrs.feed}`),
            m("div.is-message-thread", [
                this.msgs.map(msg => {
                    let key = msg.key
                    return m(getMessageComponent(msg), { key, msg })
                })
            ])
        ])
    }
}
