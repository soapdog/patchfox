/**
 * COMPONENT "MESSAGE"
 * 
 * OBJECTIVE:
 * A component that renders a single message.
 * 
 * This is a Mithril component.
 */

import Author from "./parts/author.js"
import Timestamp from "./parts/timestamp.js"
import Meta from "./parts/meta.js"
import Actions from "./actions.js"

export default class Message {
    constructor() {
        this.showRaw = false
    }

    view(vnode) {
        let msg = vnode.attrs.msg
        let date = new Date(msg.value.timestamp)
        let dateFormatOptions = { 
            weekday: "long", 
            year: "numeric", 
            month: "long", 
            day: "numeric",
            hour: "numeric", 
            minute: "numeric", 
            second: "numeric",  
        };

        let contentRaw = m("code", m("pre",JSON.stringify(msg, null, 2)))
        let type = msg.value.content.type || "type is missing"

        if (typeof msg.value.content == "string") {
            type = "PRIVATE"
        }

        return m("div.is-message", [
            m("div.is-message-head", [
                m(Author, {feed: msg.value.author}),
                m(Timestamp, {timestamp: new Intl.DateTimeFormat("en-US", dateFormatOptions).format(date)}),
                m("div.is-veil-toggle[tooltip=View Raw Message]",{
                    onclick: () => {
                        this.showRaw = !this.showRaw
                    }
                },"❚")
            ]),
            !this.showRaw ? m("div.is-message-body",  type) : m("div.is-message-body.is-raw-message", contentRaw),
            m("div.is-message-footer", [
                m(Meta, {msg: msg.value}),
                m(Actions, {msg: msg.value}) 
            ])
        ])
    }
}
