/**
 * COMPONENT "MINI MSG"
 * 
 * OBJECTIVE:
 * A small viewer for messages. Just display author and message type.
 * 
 * This is a Mithril component.
 */

export default class MiniMsg {

    view(vnode) {
        let msg = vnode.attrs.msg
        return m("div.is-minimsg", [
            m("code", msg.value.author),
            m("span", msg.value.content.type)
        ])
    }
}
