const m = require("mithril")
const { when } = require("../kernel/utils.js")

const AvatarFigure = {
  oninit: vnode => {
    vnode.state.shouldLoadAvatar = true
    vnode.state.image = false
    vnode.state.name = vnode.attrs.feed
  },
  view: vnode => {
    let feed = vnode.attrs.feed

    let inline = vnode.attrs.inline || false
    let arrow = vnode.attrs.arrow || false
    let glyph = vnode.attrs.glyph || false
    let onclick = vnode.attrs.onclick || false
    let dim = vnode.attrs.dim || false
    let flexClass = inline ? "inline-flex" : "flex"

    if (vnode.state.shouldLoadAvatar) {
      ssb.avatar(feed).then(data => {
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

    return m("div", [
      when(vnode.state.image, m("figure.avatar.cursor-pointer", { onclick: avatarClick }, m("img", { src: vnode.state.image, alt: vnode.state.name }))),

      when(
        !vnode.state.image,
        m(
          "figure.avatar.cursor-pointer",
          {
            "data-initial": vnode.state.name.slice(1, 3),
            onclick: avatarClick,
            class: dim ? "dim" : "",
          },
          m("span.text-3xl", vnode.state.name.slice(1, 3))
        )
      ),
    ])
  },
}

module.exports = AvatarFigure
