const { when } = require("../kernel/utils.js")
const m = require("mithril")

const AvatarChip = {
  oninit: (vnode) => {
    vnode.state.image = false
    vnode.state.name = vnode.attrs.feed

    ssb.avatar(vnode.attrs.feed).then((data) => {
      if (data == null) {
        return
      }
      if (data?.image) {
        vnode.state.image = patchfox.blobUrl(data.image)
      } else {
        vnode.state.image = false
      }

      vnode.state.name = data?.name || vnode.attrs.feed
      m.redraw()
    }).catch(n => {
      console.error("something odd", n)
      m.redraw()
    })
  },
  view: (vnode) => {
    let feed = vnode.attrs.feed

    let inline = vnode.attrs.inline || false
    let arrow = vnode.attrs.arrow || false
    let glyph = vnode.attrs.glyph || false
    let onclick = vnode.attrs.onclick || false
    let flexClass = inline ? "inline-flex" : "display-block"

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

    return [
      when(
        vnode.state.image,
        m(
          `.${flexClass}.items-center.p-1.gap-1.justify-center.cursor-pointer`,
          {onclick: avatarClick},
          [
            m(
              "figure.avatar.align-middle.pr-2",
              m(
                ".w-4.h-4.mask.mask-squircle",
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
          {onclick: avatarClick},
          [
            m(
              "figure.avatar.align-middle.pr-2",
              { "data-initial": vnode.state.name.slice(1, 3) },
              m(
                ".bg-neutral-focus.text-neutral-content.w-4.h-4.mask.mask-squircle",
                m("span.text-xl", vnode.state.name.slice(1, 3))
              )
            ),
            m("span.flex-1.inline-block.align-middle", vnode.state.name.slice(0,5) + "..."),
          ]
        )
      ),
      when(arrow, m("span.mr-2", m.trust("&rarr;"))),
      when(glyph, m("span.mr-2", m.trust(ssb.markdown(glyph, true)))),
    ]
  },
}

module.exports = AvatarChip
