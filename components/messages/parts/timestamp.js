/**
 * COMPONENT "Timestamp"
 * 
 * OBJECTIVE:
 * A small viewer for the Timestamp of a message.
 * 
 * This is a Mithril component.
 */

export default class Timestamp {

    view(vnode) {
        let timestamp = vnode.attrs.timestamp
        return m("span.is-timestamp", timestamp)
    }
}
