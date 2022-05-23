const m = require("mithril")
const { when } = require("../kernel/utils.js")

const AvatarMenuItem = {
  view: (vnode) => {

    const feed = vnode.attrs.feed
    const onclick = vnode.attrs.onclick

    let image = false
    let name = feed


    ssb.avatar(feed).then(data => {
      if (!data.hasOwnProperty("name")) {
        name = feed
        m.redraw()
        return
      }

      if (data.image !== null) {
        image = `${patchfox.httpUrl("/blobs/get/" + data.image)}`
      }
      name = data.name
      m.redraw()
    })

    const avatarClick = (ev) => {
      if (onclick) {
        ev.preventDefault()
        ev.stopPropagation()
        onclick({ feed, name })
      }
    }
  
    return m("div", [
      when(image, m("a.cursor-pointer", {
        href: patchfox.url("contacts", "profile", { feed }),
        onclick: avatarClick
      }, m("figure.mb-1.w-4.h-4.mask.mask-squircle",
         m("img.object-cover.avatar.avatar-sm", {src: image, alt: name})))),
      when(!image, m("a.cursor-pointer", {
        href: patchfox.url("contacts", "profile", { feed }),
        onclick: avatarClick
      }, m("span", name)))
    ])
  }
}

module.exports = AvatarMenuItem
