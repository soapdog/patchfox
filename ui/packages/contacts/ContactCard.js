const m = require("mithril")
const AvatarChip = require("../../core/components/AvatarChip.js")
const ContactCard = {
  oninit: (vnode) => {
    let msg = vnode.attrs.msg
    vnode.state.person = msg.value.author

    vnode.state.otherPersonFeed = encodeURIComponent(msg.value.content.contact)
    vnode.state.otherPersonName = vnode.state.otherPersonFeed

    ssb.avatar(msg.value.author).then((data) => {
      vnode.state.person = data.name ?? data.key
      m.redraw()
    })

    ssb
      .avatar(msg.value.content.contact)
      .then((data) => {
        vnode.state.otherPersonName = data.name ?? data.key
        m.redraw()
      })
      .catch((n) => console.log(n))
  },
  view: (vnode) => {
    let msg = vnode.attrs.msg
    let verb = msg.value.content.following ? "followed" : "unfollowed"

    if (msg.value.content.blocking) {
      verb = "blocked"
    }

    const goProfile = (ev) => {
      ev.stopPropagation()
      ev.preventDefault()
      patchfox.go("contacts", "profile", { feed: msg.value.content.contact })
    }

    return m("p.m-2", [
      m(AvatarChip, {
        inline: true,
        arrow: true,
        feed: msg.value.author
      }),
      m("span.m-2", [
        `${verb} `,
        m(
          "a.link",
          {
            href: `?pkg=contacts&view=profile&feed=${vnode.state.otherPersonFeed}`,
          },
          vnode.state.otherPersonName
        ),
      ]),
    ])
  },
}

module.exports = ContactCard
