/**
 * COMPONENT "Author"
 * 
 * OBJECTIVE:
 * A small viewer for the author of a message.
 * 
 * This is a Mithril component.
 */



export default class Author {

    constructor(vnode) {
        this.feed = vnode.attrs.feed
        this.getAvatarFromCache() // this is a promise
    }

    recycle(feed) {
        this.feed = feed
        this.getAvatarFromCache()
    }

    async getAvatarFromCache() {

        try {
            let data = await ssb.getCachedAvatar(this.feed)
            this.data = data
            if (!data.hasOwnProperty("name")) {
                throw ("empty avatar object")
            }
            m.redraw()
        } catch (n) {
            console.log(n)
            await this.getAvatarFromFeed()
            m.redraw()
        }
    }

    async getAvatarFromFeed() {
        try {
            let data = await ssb.avatar(this.feed)
            this.data = data
        } catch (n) {
            console.error(`error fetching avatar for feed: ${this.feed}`, n)
        }
    }

    view(vnode) {
        if (vnode.attrs.feed !== this.feed) {
            this.recycle(vnode.attrs.feed)
        }
        if (!this.data) {
            return m("div.is-author", [
                m("a",
                    {
                        href: `/profile/${vnode.attrs.feed}`,
                        oncreate: m.route.link,
                        onupdate: m.route.link
                    }, this.feed.slice(0, 5))
            ])
        } else {
            return m("div.is-author", [
                m("img", { src: `http://localhost:8989/blobs/get/${this.data.image}` }),
                m("a", {
                    href: `/profile/${vnode.attrs.feed}`,
                    oncreate: m.route.link,
                    onupdate: m.route.link
                }, this.data.name)
            ])
        }
    }
}
