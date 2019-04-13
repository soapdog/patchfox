/**
 * COMPONENT "MESSAGE"
 * 
 * OBJECTIVE:
 * A component that renders a single message.
 * 
 * This is a Mithril component.
 */

import GenericMessage from "./types/generic-message.js" 
import ChannelMessage from "./types/channel-message.js"
import VoteMessage from "./types/vote-message.js"
import ContactMessage from "./types/contact-message.js"
import PostMessage from "./types/post-message.js"


let components = {
    "channel": ChannelMessage,
    "vote": VoteMessage,
    "contact": ContactMessage,
    "post": PostMessage
}

export function getMessageComponent(msg) {
    let type = msg.value.content.type || false

    if (typeof msg.value.content == "string") {
        type = "private"
    }
    if (type && components.hasOwnProperty(type)) {
        return components[type]
    }

    return GenericMessage
}


