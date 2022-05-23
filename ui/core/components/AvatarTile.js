const m = require("mithril")
const timestamp = require("./timestamp.js")
const { when } = require("../kernel/utils.js")

const AvatarTile = {
  oninit: (vnode) => {
    vnode.state.shouldLoadAvatar = true
    vnode.state.name = vnode.attrs.feed
    vnode.state.image = "assets/images/icon.png"
  },
  view: (vnode) => {
    let feed = vnode.attrs.feed
    let time = vnode.attrs.time || false
    const onclick = vnode.attrs.onclick || false

    if (vnode.state.shouldLoadAvatar) {
      ssb.avatar(feed).then((data) => {
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

    const click = () => {
      if (onclick) {
        onclick({ feed, time })
      }
    }

    return m(".flex.flex-row.cursor-pointer", { onclick: click }, [
      m(
        ".avatar",
        m(
          ".m-2.w-14.h-14.mask.mask-squircle",
          m("img", { src: vnode.state.image, alt: vnode.state.name })
        )
      ),
      m(".tile-content", [
        m(".tile-title", vnode.state.name),
        m("small.tile-subtitle.text-gray", when(time, timestamp(time))),
      ]),
    ])
  },
}

module.exports = AvatarTile
