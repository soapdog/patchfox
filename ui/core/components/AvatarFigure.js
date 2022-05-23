const m = require("mithril")
const { when } = require("../kernel/utils.js")

const AvatarFigure = {
  view: (vnode) => {
    let feed = vnode.attrs.feed
    let dim = vnode.attrs.dim || false
    let onclick = vnode.attrs.onclick || false
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
    
    return m("div",[
      when(image, m("figure.avatar.cursor-pointer", {onclick: avatarClick}, 
        m("img", {src: image, alt: name}))),
        
      when(!image, m("figure.avatar.cursor-pointer", {
        "data-initial": name.slice(1,3),
        onclick: avatarClick,
        classes: dim ? "dim": ""
      }, m("span.text-3xl", name.slice(1,3))))
      
    ])
  }
}

module.exports = AvatarFigure
