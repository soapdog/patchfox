/**
 * COMPONENT "MESSAGE"
 * 
 * OBJECTIVE:
 * A component that renders a single message.
 * 
 * This is a Mithril component.
 */

import Author from "../parts/author.js"
import Timestamp from "../parts/timestamp.js"


export default class GenericMessage {

    constructor(vnode) {
        this.showRaw = false
        let msg = vnode.attrs.msg


        this.type = msg.value.content.type || "type is missing"

        if (typeof msg.value.content == "string") {
            this.type = "🔒PRIVATE"
        }
    }
    content() {
        return ""
    }

    description(msg) {
        return `
            <p>This is a message of type <code>${this.type}</code>.</p>
            <p>You can learn more about this type of message by going to <a href="">the documentation for messages with type <code>${this.type}</code></a>.</p>
            <p>In the case you want to tweak how this view works, check out <a href="">components/message.js</a></p>.
        `
    }

    header(msg) {
        return this.type
    }


    view(vnode) {
        let msg = vnode.attrs.msg
        let content = this.content(msg)
        let description = this.description(msg)

        let contentRaw = m("div.column.col-9",
            m("pre.code", 
                m("code", JSON.stringify(msg, null, 2))
            ))

        return m("div.container.is-message", {key: msg.key},[
            m("div.is-message-head", [
                m(Author, { feed: msg.value.author }),
                m("span.is-message-header", m.trust(this.header(msg))),
                m("i.icon.icon-more-vert.float-right", {
                    onclick: () => {
                        this.showRaw = !this.showRaw
                    }
                },""),
                m(Timestamp, { timestamp: msg.value.timestamp })
            ]),
            !this.showRaw ? m("div.is-message-body",  m.trust(content)) : m("div.columns",
                [
                    contentRaw,
                    m("div.divider-vert"),
                    m("div.column", m.trust(description))
                ]),
            m("div.divider")

        ])
    }


}
