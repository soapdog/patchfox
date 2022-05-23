const { when } = require("../kernel/utils.js")
const m = require("mithril")

const AvatarChip = {
  oninit: (vnode) => {
    vnode.state.shouldLoadAvatar = true
    vnode.state.image = false
    vnode.state.name = vnode.attrs.feed
  },
  view: (vnode) => {
    let feed = vnode.attrs.feed

    let inline = vnode.attrs.inline || false
    let arrow = vnode.attrs.arrow || false
    let glyph = vnode.attrs.glyph || false
    let onclick = vnode.attrs.onclick || false
    let flexClass = inline ? "inline-flex" : "flex"

    if (vnode.state.shouldLoadAvatar) {
      ssb.avatar(feed).then((data) => {
        vnode.state.shouldLoadAvatar = false
        if (!data || !data.hasOwnProperty("name")) {
          // failed the request...
          vnode.state.name = feed
          m.redraw()
          return
        }
  
        if (data.image !== null && data.image !== undefined) {
          vnode.state.image = `${patchfox.httpUrl("/blobs/get/" + data.image)}`
        }
  
        vnode.state.name = data.name
        m.redraw()
      })
    }

    const avatarClick = () => {
      if (onclick) {
        onclick({ feed, name: vnode.state.name })
      }
    }

    return [
      when(
        vnode.state.image,
        m(
          `.${flexClass}.items-center.p-1.gap-1.justify-center.cursor-pointer`,
          { onclick: avatarClick },
          [
            m(
              "figure.avatar",
              m(
                ".mb-1.w-4.h-4.mask.mask-squircle",
                m("img", { src: vnode.state.image, alt: vnode.state.name })
              )
            ),
            m("span.flex-1.inline-block.align-middle", vnode.state.name),
          ]
        )
      ),
      when(
        !vnode.state.image,
        m(
          `.${flexClass}.items-center.p-1.gap-1.justify-center.cursor-pointer`,
          { onclick: avatarClick },
          [
            m(
              "figure.avatar",
              { "data-initial": vnode.state.name.slice(1, 3) },
              m(
                ".mb-1.bg-neutral-focus.text-neutral-content.w-4.h-4.mask.mask-squircle",
                m("span.text-xl", vnode.state.name.slice(1, 3))
              )
            ),
            m("span.flex-1.inline-block.align-middle", vnode.state.name),
          ]
        )
      ),
      when(arrow, m("span.mr-2", "&rarr;")),
      when(glyph, m("span.mr-2", ssb.markdown(glyph, true))),
    ]
  },
}

module.exports = AvatarChip
