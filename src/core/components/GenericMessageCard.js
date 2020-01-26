const m = require("mithril")
const Card = require("./ui/Card.js")
const MessageDropdown = require("./MessageDropdown.js");
const { timestamp } = require("./timestamp.js");
const { isMessageBlured } = require("../platforms/ssb/abusePrevention.js");
const _ = require("lodash");

require("./GenericMessageCard.css")

class GenericMessageCard {
    constructor(vnode) {
        this.msg = vnode.attrs.msg

        this.feed = this.msg.value.author

        this.author = {
            image: "images/icon.png",
            name: this.feed
        }

        this.blured = isMessageBlured(this.msg);

        this.showRaw = false;
        this.rawContent = JSON.stringify(this.msg, null, 2);
        this.dropdownActive = false;
        this.privateMsgForYou = false;

        ssb.avatar(this.feed).then(data => {
            console.log("data", data)
                // if (data.image !== null) {
                //     this.author.image = patchfox.httpUrl(`/blobs/get/${encodeURIComponent(data.image)}`);
                // }
                // this.author.name = data.name;
                // m.redraw()
        });
    }

    toggleRawMessage() {
        this.showRaw = !this.showRaw;
        this.dropdownActive = false;
    };

    goProfile(ev) {
        ev.preventDefault()
        if (ev.ctrlKey) {
            window.open(
                `?pkg=contacs&view=profile&feed=${encodeURIComponent(this.feed)}#/profile`
            );
        } else {
            patchfox.go("contacts", "profile", { feed: this.feed });
        }
    };



    image(vnode) {}

    headerLeft(vnode) {
        return m(".card-title",
            m(".tile.tile-centered.feed-display", {
                onclick: this.goProfile
            }, [
                m(".tile-icon", m(".example-tile-icon", m("img.avatar.avatar-lg", {
                    alt: this.author.name,
                    src: this.author.image
                }))),
                m(".tile-content", [
                    m(".tile-title", this.author.name),
                    m("small.tile-subtitle.text-gray", timestamp(this.msg.value.timestamp))
                ])
            ]))
    }

    headerRight(vnode) {
        let channel = this.msg.value.content.channel
        if (channel) {
            return m("span.text-gray.channel-display", {
                onclick: () => patchfox.go("hub", "channel", { channel })
            }, `#${channel}`)
        }
    }

    dropdown(vnode) {
        return m(MessageDropdown, {
            msg: this.msg,
            toggleRawMessage: () => console.log("toggle raw msg")
        })
    }

    headerCenter(vnode) {

    }

    header(vnode) {
        return [
            m(".float-left", this.headerLeft(vnode)),
            this.headerCenter(vnode),
            m(".float-right", this.headerRight(vnode)),
            m(".float-right", this.dropdown(vnode))
        ]
    }

    body(vnode) {
        let msg = vnode.attrs.msg

        let rawContent = JSON.stringify(msg, null, 2);

        return m(Card, m("pre.code", m("code", rawContent)))
    }

    footer(vnode) {}

    view(vnode) {
        return m(Card, {
            image: this.image(vnode),
            header: this.header(vnode),
            footer: this.footer(vnode)
        }, this.body(vnode))
    }
}

module.exports = GenericMessageCard