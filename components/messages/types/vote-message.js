/**
 * COMPONENT "CHANNEL MESSAGE"
 * 
 * OBJECTIVE:
 * A component that renders a single message.
 * 
 * This is a Mithril component.
 */

import GenericMessage from "./generic-message.js"
import { SsbSchemaHandler } from "../../ssb-schema-handler.js";

export default class VoteMessage extends GenericMessage {

    oninit(vnode) {
        let msg = vnode.attrs.msg
        let msgid = msg.value.content.vote.link
        this.link = msgid.slice(1)
        this.label = msg.value.content.vote.link

        ssb.blurbFromMsg(msgid, 100).then((blurb) => {
            this.label = blurb
            m.redraw()
        })
    }

    header(msg) {
        let exprs = msg.value.content.vote.expression
        let link = msg.value.content.vote.link
        return `${exprs} <a href="#!/thread/${this.link}">${this.label}</a>`
    }

}
