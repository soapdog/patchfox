const m = require("mithril")
const AvatarChip = require("../../core/components/AvatarChip.js")
const ChannelCard = {
  oninit: (vnode) => {
    vnode.state.person = vnode.attrs.msg.value.author
  },
  view: (vnode) => {
    let msg = vnode.attrs.msg

    let verb = msg.value.content.subscribed ? "subscribed" : "unsubscribed"
    let channel = encodeURIComponent(msg.value.content.channel)

    ssb.avatar(msg.value.author).then((data) => {
      vnode.state.person = data.name
      m.redraw()
    })

    const goChannel = (ev) => {
      ev.stopPropagation()
      ev.preventDefault()
      patchfox.go("hub", "channel", { channel: msg.value.content.channel })
    }

    const avatarClick = (ev) => {
      let feed = ev.detail.feed
      patchfox.go("contacts", "profile", { feed })
    }

    return m("p.m-2", [
      m(AvatarChip, {
        inline: true,
        arrow: true,
        feed: msg.value.author,
        onclick: avatarClick,
      }),
      verb,
      m(
        "a",
        {
          href: `?pkg=hub&view=channel&channel=${channel}`,
          onclick: goChannel,
        },
        `#${channel}`
      ),
    ])
  },
}

module.exports = ChannelCard
