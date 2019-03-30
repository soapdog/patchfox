/**
 * COMPONENT "Actions"
 * 
 * OBJECTIVE:
 * A small viewer for the Actions of a message.
 * 
 * This is a Mithril component.
 */

export default class Actions {

    view(vnode) {
        let msg = vnode.attrs.msg
        return m("div.is-message-actions", [
            m("a[href=/reply]", "reply"),
            m("a[href=/like]", "like"),

        ])
    }
}
