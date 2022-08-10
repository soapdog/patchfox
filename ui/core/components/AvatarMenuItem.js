const m = require("mithril")
const { when } = require("../kernel/utils.js")

const AvatarMenuItem = {
  oninit: vnode => {
    vnode.state.shouldLoadAvatar = true
    vnode.state.name = vnode.attrs.feed
    vnode.state.image = "assets/images/icon.png"
  },
  view: vnode => {
    let feed = vnode.attrs.feed
    let time = vnode.attrs.time || false
    const onclick = vnode.attrs.onclick || false

    if (vnode.state.shouldLoadAvatar) {
      ssb.avatar(feed).then(data => {
        // console.log(`avatar for ${feed}`, data)
        if (data?.image) {
          vnode.state.image = `${patchfox.blobUrl(data.image)}`
        }
        vnode.state.name = data.name
        vnode.state.shouldLoadAvatar = false
        m.redraw()
      })
    }

    const avatarClick = ev => {
      ev.preventDefault()
      if (onclick) {
        onclick({ feed, name: vnode.state.name })
        return
      } 

      if (ev.altKey || ev.button == 1) {
        let url = patchfox.url("contacts", "profile", { feed })
        window.open(url)
        return 
      }

      patchfox.go("contacts", "profile", { feed })
    }

    return m("li", [
      when(
        vnode.state.image,
        m(
          "a.cursor-pointer",
          {
            href: patchfox.url("contacts", "profile", { feed }),
            onclick: avatarClick,
          },
          m("div", [
            m("img.object-cover.avatar.avatar-sm.w-4.h-4.m-2", { src: vnode.state.image, alt: vnode.state.name }), 
            m("span", vnode.state.name)
          ])
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
