const m = require("mithril")
const { when } = require("../kernel/utils.js")

const AvatarMenuItem = {
  oninit: (vnode) => {
    vnode.state.shouldLoadAvatar = true
    vnode.state.name = vnode.attrs.feed
    vnode.state.image = "images/icon.png"
  },
  view: (vnode) => {
    let feed = vnode.attrs.feed
    let time = vnode.attrs.time || false
    const onclick = vnode.attrs.onclick || false

    if (vnode.state.shouldLoadAvatar) {
      ssb.avatar(feed).then((data) => {
        // console.log(`avatar for ${feed}`, data)
        if (data.image !== null && data.image !== undefined) {
          vnode.state.image = `${patchfox.blobUrl(data.image)}`
        }
        vnode.state.name = data.name
        vnode.state.shouldLoadAvatar = false
        m.redraw()
      })
    }

    const click = () => {
      if (onclick) {
        onclick({ feed, time })
      }
    }

    return m("div", [
      when(
        vnode.state.image,
        m(
          "a.cursor-pointer",
          {
            href: patchfox.url("contacts", "profile", { feed }),
            onclick: avatarClick,
          },
          m(
            "figure.mb-1.w-4.h-4.mask.mask-squircle",
            m("img.object-cover.avatar.avatar-sm", { src: vnode.state.image, alt: vnode.state.name })
          )
        )
      ),
      when(
        !vnode.state.image,
        m(
          "a.cursor-pointer",
          {
            href: patchfox.url("contacts", "profile", { feed }),
            onclick: avatarClick,
          },
          m("span", vnode.state.name)
        )
      ),
    ])
  },
}

module.exports = AvatarMenuItem
