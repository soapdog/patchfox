const m = require("mithril")
const stream = require("mithril/stream")

const QueryRepeater = {
  view: (vnode) => {  
    let filter = vnode.attrs.filter
    let reverse = vnode.attrs.reverse || false
    let map = vnode.attrs.map || null 
    let reduce = vnode.attrs.reduce || null
    let limit = vnode.attrs.limit || false
    let state = stream()
  
    const loading = m(".loading")
    
    ssb.query(filter, reverse, map, reduce, limit)
      .then((msgs) => state(msgs.map(msg => m(msg))))
    
    state(loading)
    
    return m(state)
  }
}

module.exports = QueryRepeater
