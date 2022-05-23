const m = require("mithril")

const AvatarContainer = {
  view: (vnode) => {
    return m("div", { style: { columns: "3 200px" } }, vnode.children)
  },
}

module.exports = AvatarContainer
