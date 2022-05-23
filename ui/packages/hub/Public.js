const m = require("mithril")
const MessageRenderer = require("../../core/components/MessageRenderer.js")
const PublicView = {
  oninit: (vnode) => {
    vnode.state.shouldLoadMessages = true
    vnode.state.msgs = []
    vnode.state.lt = vnode.attrs.lt || false
  },
  view: (vnode) => {
    console.log("hub.public view")
    let limit = vnode.attrs.limit || false

    patchfox.title("Public")

    let opts = {}
    if (vnode.state.lt) {
      opts.lt = Number(vnode.state.lt)
      patchfox.title(`Public - ${vnode.state.lt}`)
    }

    console.time("public")

    if (vnode.state.shouldLoadMessages == true) {
      ssb
        .public(opts)
        .then((ms) => {
          console.timeEnd("public")
          vnode.state.msgs = ms
          window.scrollTo(0, 0)
          vnode.state.shouldLoadMessages = false
          console.log("Fetch public, calling redraw!")
          m.redraw()
        })
        .catch((n) => {
          throw n
        })
    }

    const goNext = () => {
      vnode.state.lt = vnode.state.msgs[vnode.state.msgs.length - 1].value.timestamp
      vnode.state.msgs = []
      vnode.state.shouldLoadMessages = true
      console.log("olha o redraw!", vnode.state)
      // patchfox.go("hub", "public", { lt })
    }

    const goPrevious = () => {
      vnode.state.msgs = []
      vnode.state.shouldLoadMessages = true
      history.back()
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
