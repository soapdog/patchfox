/**
 * COMPONENT "CHANNEL MESSAGE"
 * 
 * OBJECTIVE:
 * A component that renders a single message.
 * 
 * This is a Mithril component.
 */

import GenericMessage from "./generic-message.js"

export default class ChannelMessage extends GenericMessage {

    header(msg) {
        let verb = msg.value.content.subscribed ? "subscribed to" : "unsubscribed from"
        return `${verb} <a href="#!/channel/${msg.value.content.channel}">#${msg.value.content.channel}</a>`
    }

}
