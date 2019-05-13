/**
 * COMPONENT "CHANNEL MESSAGE"
 * 
 * OBJECTIVE:
 * A component that renders a single message.
 * 
 * This is a Mithril component.
 */

import GenericMessage from "./generic-message.js"

export default class VoteMessage extends GenericMessage {

    header(msg) {
        let exprs = msg.value.content.vote.expression
        let link = msg.value.content.vote.link
        return `${exprs} <a href="#!/thread/${link}">${link}</a>`
    }

}
