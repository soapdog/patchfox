const m = require("mithril")
const { when } = require("../kernel/utils.js")

const AvatarRound = {
  view: (vnode) => {
    let feed = vnode.attrs.feed
    let dim = vnode.attrs.dim || false
    const onclick = vnode.attrs.onclick

    let image = false
    let name = feed

    ssb.avatar(feed).then(data => {
      if (data.image !== null && data.image !== undefined) {
        image = `${patchfox.blobUrl(data.image)}`
      }
      name = data.name
      m.redraw()
    })

    const avatarClick = () => {
      if (onclick) {
        onclick({feed, name})
      }
    }
    
    if (image) {
      return m("figure.avatar.cursor-pointer", {onclick: avatarClick}, 
        m(".mb-8.w-14.h-14.mask.mask-squircle", m("img", {src: image, alt: name})))
    } else {
      return m("figure.avatar.cursor-pointer", {onclick: avatarClick, "data-initial": name.slice(1,3)}, 
        m(".mb-8.bg-neutral-focus.text-neutral-content.w-14.h-14.mask mask-squircle", m("span.text-3xl", name.slice(1,3)))) 
    }
  }
}

module.exports = AvatarRound
