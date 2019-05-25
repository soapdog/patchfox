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
        this.user = false
    }

    async oninit(vnode) {
        let about = await ssb.profile(vnode.attrs.key)
        let avatar = await ssb.avatar(vnode.attrs.key)
        if (avatar.image) {
            this.user.description = about
                .reverse()
                .find((a) => a.hasOwnProperty("description"))
                ["description"]
        }

        m.redraw()
    }

    view(vnode) {
        if (!this.user) {
            return m("p", "loading...")
        } else {
            let user = this.user.about[this.user.about.length-1].value.content
            console.log("user", user)
            return m("div", [
                m("div.is-feed-metadata", [
                    m("img.is-avatar", { src: `http://localhost:8989/blobs/get/${user.image}` }),
                    m("h1", user.name),
                    m("p", user.description),
                    m("code", user.about)
                ]),
                m("div.is-message-thread", [
                    this.user.msgs.map(msg => {
                        let key = msg.key
                        return m(getMessageComponent(msg), { key, msg })
                    })
                ])
            ])
        }
    }
}
