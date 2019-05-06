/**
 * COMPONENT "CHANNEL MESSAGE"
 * 
 * OBJECTIVE:
 * A component that renders a single message.
 * 
 * This is a Mithril component.
 */

import GenericMessage from "./generic-message.js"

export default class ContactMessage extends GenericMessage {

    constructor(vnode) {
        super(vnode)
        this.msg = vnode.attrs.msg
        this.feed = this.msg.value.content.contact
    }

    async oninit(vnode) {
        try {
            let data = await this.driver.avatar(this.feed)
            this.data = data
            m.redraw()
        } catch (n) {
            console.error(`error fetching avatar for feed: ${this.feed}`, n)
        }
    }

    header(msg) {
        let verb = msg.value.content.following ? "followed" : "unfollowed"
        if (!this.data) {
            return `${verb} <a href="#!/profile/${this.feed}">${this.feed.slice(5)}...</a>`
        } else {
            return `${verb} <a href="#!/profile/${this.feed}">${this.data.name}</a>`
        }
    }

}
