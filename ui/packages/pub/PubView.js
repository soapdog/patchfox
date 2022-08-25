const m = require("mithril")
const AvatarChip = require("../../core/components/AvatarChip.js")
const PubView = {
  view: (vnode) => {
    let msg = vnode.attrs.msg

    let encodedid = encodeURIComponent(msg.value.content.address.key)
    let host = msg.value.content.address.host
    let port = msg.value.content.address.port

    const goProfile = (ev) => {
      ev.stopPropagation()
      ev.preventDefault()
      patchfox.go("contacts", "profile", {
        feed: msg.value.content.address.key,
      })
    }

    return m("p.m-2", [
      m(AvatarChip, {
        inline: true,
        arrow: true,
        feed: msg.value.author,
      }),
      "announced pub",
      m(
        "a",
        {
          href: `?pkg=contacts&view=profile&feed=${encodedid}`,
          onlick: goProfile,
        },
        `${host}:${port}`
      ),
    ])
  },
}

module.exports = PubView
