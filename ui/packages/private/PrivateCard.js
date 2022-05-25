const m = require("mithril")

const PrivateCard = {
  view: vnode => {
    let msg = vnode.attrs.msg 
    
    return m(".card-body", m("p", "🔒 PRIVATE"))
  }
}

module.exports = PrivateCard
