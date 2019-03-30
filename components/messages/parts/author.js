/**
 * COMPONENT "Author"
 * 
 * OBJECTIVE:
 * A small viewer for the author of a message.
 * 
 * This is a Mithril component.
 */

export default class Author {

    view(vnode) {
        let feed = vnode.attrs.feed
        return m("span.is-author", feed)
    }
}
