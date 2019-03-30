/**
 * COMPONENT "Meta"
 * 
 * OBJECTIVE:
 * A small viewer for the Meta of a message.
 * 
 * This is a Mithril component.
 */

export default class Meta {

    view(vnode) {
        let msg = vnode.attrs.msg
        return m("div.is-message-meta", [
            m("a[href=/reply]", "view RAW"),
            m("a[href=/like]", "Permalink"),

        ])
    }
}
