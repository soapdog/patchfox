const m = require("mithril")
const MessageRenderer = require("../../core/components/MessageRenderer.js")
const timestamp = require("../../core/components/timestamp.js")

const PublicView = {
  oninit: (vnode) => {
    vnode.state.shouldLoadMessages = true
    vnode.state.msgs = []
    vnode.state.rootsOnly = false
    vnode.state.lt = []

    if (vnode.attrs.lt) {
      vnode.state.lt.push(vnode.attrs.lt)
    }
  },
  view: (vnode) => {
    console.log("hit")
    let limit = vnode.attrs.limit || false

    let opts = {}
    if (vnode.state.lt.length > 0) {
      let lt = vnode.state.lt[vnode.state.lt.length - 1]
      opts.lt = Number(lt)
      patchfox.title(timestamp(lt))
    }


    if (vnode.state.shouldLoadMessages == true) {
      console.time("public")
      ssb
        .public(opts)
        .then((ms) => {
          console.timeEnd("public")
          vnode.state.msgs = ms
          window.scrollTo(0, 0)
          vnode.state.shouldLoadMessages = false
          m.redraw()
        })
        .catch((n) => {
          throw n
        })
    }

    const goNext = () => {
      vnode.state.lt.push(vnode.state.msgs[vnode.state.msgs.length - 1].value.timestamp)
      vnode.state.msgs = []
      vnode.state.shouldLoadMessages = true
      patchfox.addHistory("hub", "public", { lt: vnode.state.lt[vnode.state.lt.length-1] })
    }

    const goPrevious = () => {
      vnode.state.msgs = []
      vnode.state.shouldLoadMessages = true
      vnode.state.lt.pop()
    }

    if (vnode.state.shouldLoadMessages) {
      return m(".flex.justify-center", m("i.fas.fa-spinner.fa-3x.fa-spin"))
    }

    if (!vnode.state.shouldLoadMessages && vnode.state.msgs.length > 0) {
      return [
        ...vnode.state.msgs.map((msg) => m(MessageRenderer, { msg })),
        m("br"),
        m(".btn-group", [
          m(
            "button.btn.btn-outline.btn-wide",
            { onclick: goPrevious },
            "Previous"
          ),
          m("button.btn.btn-outline.btn-wide", { onclick: goNext }, "Next"),
        ]),
      ]
    }
  },
}

module.exports = PublicView
