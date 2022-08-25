const m = require("mithril")
const { when } = require("../kernel/utils.js")

const MenuItem = {
  view: (vnode) => {  
    let label = vnode.attrs.label
    let icon = vnode.attrs.icon || false
    let link = vnode.attrs.link
    const onclick = vnode.attrs.onclick

    const click = (ev) => {
      if (onclick) {
        ev.preventDefault()
        onclick("click")
      }
    }
    
    return m("li.cursor-pointer", m("a", {
      href: link,
      onclick: click,
      target: "_blank"
    }, [
      when(icon, m(`i.fas.fa-{icon}`, m.trust("&nbsp;&nbsp;"))),
      label
    ]))
  }
}

module.exports = MenuItem
