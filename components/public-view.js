/**
 * COMPONENT "PUBLIC VIEW"
 * 
 * OBJECTIVE:
 * Provide a public view of your feed.
 * 
 * This is a Mithril.
 */

import { getDriver } from "../drivers/driver.js"
import { getMessageComponent } from "./messages/message.js"

export class PublicView {
    constructor() {
        this.driver = getDriver()
        this.msgs = []
        this.limit = 10
    }

    async oninit() {
        this.msgs = await this.driver.public({ limit: this.limit, reverse: true })
        console.log(this.msgs)
        m.redraw()
    }

    async fetchNext() {
        let lastMsg = this.msgs[this.msgs.length - 1]
        this.msgs = await this.driver.public({ limit: this.limit, reverse: true, lt: lastMsg.rts })
        console.log("fetchmore", this.msgs)
        m.redraw()
        window.scrollTo(0, 0)
    }

    async fetchPrevious() {
        let firstMsg = this.msgs[0]
        this.msgs = await this.driver.public({ limit: this.limit, reverse: true, gt: firstMsg.rts })
        console.log("fetchmore", this.msgs)
        m.redraw()
        window.scrollTo(0, 0)
    }

    view() {
        return m("div", [
            m("h1", "Public"),
            m("div.is-message-thread", [
                this.msgs.map(msg => {
                    let key = msg.key
                    return m(getMessageComponent(msg), { key, msg })
                })
            ]),
            m("div.is-pagination-controls", [
                m("a[href=/public]", {
                    oncreate: m.route.link,
                    onclick: () => this.fetchPrevious()
                }, "Newer"),
                m("a[href=/public]", {
                    oncreate: m.route.link,
                    onclick: () => this.fetchNext()
                }, "Older")
            ])
        ])
    }
}
