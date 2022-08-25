const m = require("mithril")

const GenericMsg = {
  view: (vnode) => {
    let msg = vnode.attrs.msg
    
    let rawContent = JSON.stringify(msg, null, 2)
    
    return m(".card-body", m("pre.code", {style: {overflow: "scroll"}}, rawContent))
  }
}

module.exports = GenericMsg
