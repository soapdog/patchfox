const m = require("mithril")
  const MessageRenderer = require("../../core/components/MessageRenderer.js")
  const Spinner = require("../../core/components/Spinner.js")
  const pull = require("pull-stream")
  
  const MentionsView = {
    oninit: (vnode) => {
      vnode.state.msgs = []
      vnode.state.shouldLoadMessages = true
    },
    view: (vnode) => {
      let unsub
    
      let lt = vnode.attrs.lt || false
    
      if (vnode.state.shouldLoadMessages) {
        console.log("Loading mentions...", lt)
        window.scrollTo(0, 0)
        vnode.state.msgs = []
        ssb
          .mentions(ssb.feed, Number(lt))
          .then(ms => {
            vnode.state.shouldLoadMessages = false
            vnode.state.msgs = ms
            m.redraw()
          })
          .catch(n =>
            patchfox.go("errorHandler", {
              error: n
            })
          )
      }
      
            
      const goNext = () => {
        let lt = vnode.state.msgs[vnode.state.msgs.length - 1].value.timestamp
        vnode.state.msgs = []
        patchfox.go("hub", "mention", {
          lt
        })
      }
      
      const goPrevious = () => {
        history.back()
      }
      
      const pagination = [
        m("br"),
        m(".btn-group", [
          m("button.btn.btn-outline.btn-wide", {onclick: goPrevious}, "Previous"),
          m("button.btn.btn-outline.btn-wide", {onclick: goNext}, "Next")
        ])
      ]
      
      return vnode.state.shouldLoadMessages ? m(Spinner) : [
        vnode.state.msgs.map(msg => m(MessageRenderer, {msg})),
        pagination
      ]
    }
}

module.exports = MentionsView

