const m = require("mithril")
const timestamp = require("./timestamp.js")
const { when } = require("../kernel/utils.js")

const AvatarTile = {
  view: (vnode) => {
    let feed = vnode.attrs.feed
    let time = vnode.attrs.time || false
    const onclick = vnode.attrs.onclick || false

    let image = "images/icon.png"
    let name = feed

    ssb.avatar(feed).then((data) => {
      // console.log(`avatar for ${feed}`, data)
      if (data.image !== null && data.image !== undefined) {
        image = patchfox.httpUrl(`/blobs/get/${data.image}`)
      }
      name = data.name
      m.redraw()
    })

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
          m("img", { src: image, alt: name })
        )
      ),
      m(".tile-content", [
        m(".tile-title", name),
        m("small.tile-subtitle.text-gray", when(time, timestamp(time))),
      ]),
    ])
  },
}

module.exports = AvatarTile
