const m = require("mithril")
const timestamp = require("./timestamp.js")
const { when } = require("../kernel/utils.js")

const AvatarTile = {
  oninit: vnode => {
    vnode.state.name = vnode.attrs.feed
    vnode.state.image = `${process.cwd()}/ui/assets/images/icon.png`

    const defaultAvatarLoadingFunction = () => {
      ssb.avatar(vnode.attrs.feed).then(data => {
        if (!data) {
          return
        }
        // console.log(`avatar for ${feed}`, data)
        if (data.image !== null && data.image !== undefined) {
          vnode.state.image = `${patchfox.blobUrl(data.image)}`
        }
        vnode.state.name = data.name
        vnode.state.shouldLoadAvatar = false
        m.redraw()
      })
    }

    if (vnode.attrs?.avatarLoadingFunction) {
      vnode.attrs.avatarLoadingFunction().then(( {name, image} ) => {
        vnode.state.name = name
        vnode.state.image = image 
        m.redraw()
      })
    } else {
      defaultAvatarLoadingFunction()
    }
  },
  view: vnode => {
    let feed = vnode.attrs.feed
    let time = vnode.attrs.time || false
    const onclick = vnode.attrs.onclick || false

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

    return m(
      ".flex.flex-row.cursor-pointer",
      {
        onclick: avatarClick,
      },
      [
        m(".avatar", m(".m-2.w-14.h-14.mask.mask-squircle", m("img", { src: vnode.state.image, alt: vnode.state.name }))), 
        m(".tile-content", [m(".tile-title", vnode.state.name), m("small.tile-subtitle.text-gray", when(time, timestamp(time)))])
      ]
    )
  },
}

module.exports = AvatarTile
