const m = require("mithril")
const { when } = require("../kernel/utils.js")

const AvatarRound = {
  oninit: (vnode) => {
    vnode.state.shouldLoadAvatar = true
    vnode.state.name = vnode.attrs.feed
    vnode.state.image = "images/icon.png"
  },
  view: (vnode) => {
    let feed = vnode.attrs.feed
    let dim = vnode.attrs.dim || false
    const onclick = vnode.attrs.onclick


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

    const avatarClick = () => {
      if (onclick) {
        onclick({feed, name})
      }
    }
    
    if (image) {
      return m("figure.avatar.cursor-pointer", {onclick: avatarClick}, 
        m(".mb-8.w-14.h-14.mask.mask-squircle", m("img", {src: vnode.state.image, alt: vnode.state.name})))
    } else {
      return m("figure.avatar.cursor-pointer", {onclick: avatarClick, "data-initial": vnode.state.name.slice(1,3)}, 
        m(".mb-8.bg-neutral-focus.text-neutral-content.w-14.h-14.mask mask-squircle", m("span.text-3xl", vnode.state.name.slice(1,3)))) 
    }
  }
}

module.exports = AvatarRound
