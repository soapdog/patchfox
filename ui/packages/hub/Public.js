const m = require("mithril")
const MessageRenderer = require("../../core/components/MessageRenderer.js")
const timestamp = require("../../core/components/timestamp.js")

const PublicView = {
  oninit: vnode => {
    vnode.state.loadingPhase = "load"
    vnode.state.msgs = []
    vnode.state.rootsOnly = false
    vnode.state.lt = []
    vnode.state.filter = "All"

    if (vnode.attrs.lt) {
      vnode.state.lt.push(vnode.attrs.lt)
    }
  },
  view: vnode => {
    let limit = vnode.attrs.limit || false

    let opts = {
      filter: vnode.state.filter,
    }

    if (vnode.state.lt.length > 0) {
      let lt = Number(vnode.state.lt[vnode.state.lt.length - 1])
      opts.lt = lt
      patchfox.title(timestamp(lt))
    } else {
      patchfox.title("")
    }

    if (vnode.state.loadingPhase == "load") {
      vnode.state.loadingPhase = "loading"
      console.time("public timeline")
      ssb
        .public(opts)
        .then(ms => {
          console.timeEnd("public timeline")
          console.log(ms)
          vnode.state.msgs = ms
          window.scrollTo(0, 0)
          vnode.state.loadingPhase = "loaded"
          m.redraw()
        })
        .catch(n => {
          vnode.state.loadingPhase = "error"
          vnode.state.error = n
          m.redraw()
        })
    }

    const makeFilterButton = label => {
      let selected = vnode.state.filter == label
      let selector = selected ? "li.bordered" : "li"
      return m(
        selector,
        m(
          "a",
          {
            onclick: () => {
              vnode.state.filter = label
              vnode.state.msgs = []
              vnode.state.lt = []
              vnode.state.loadingPhase = "load"
            },
          },
          label
        )
      )
    }

    // Removing this header temporarily as the new preferences
    // system allows more fine-grained control over filtering.
    //
    // Leaving it commented out here because I'm not sure about it
    // and life it too short to fiddle with git.
    //
    // const header = m(".navbar.mb-2.text-base-content", [
    //   m(".navbar-start",
    //     m("ul.menu.menu-horizontal.bg-secondary.bg-secondary-content", [
    //       makeFilterButton("All"),
    //       makeFilterButton("Friends"),
    //       makeFilterButton("Following")
    //     ]))
    // ])

    const goNext = () => {
      vnode.state.lt.push(vnode.state.msgs[vnode.state.msgs.length - 1].value.timestamp)
      vnode.state.msgs = []
      vnode.state.loadingPhase = "load"
      patchfox.addHistory("hub", "public", { lt: vnode.state.lt[vnode.state.lt.length - 1] })
      window.scrollTo(0, 0)
    }

    const goPrevious = () => {
      vnode.state.msgs = []
      vnode.state.loadingPhase = "load"
      vnode.state.lt.pop()
      window.scrollTo(0, 0)
    }

    if (vnode.state.loadingPhase == "loading") {
      return m(".flex.justify-center", m("i.fas.fa-spinner.fa-3x.fa-spin"))
    }

    if (vnode.state.loadingPhase == "error") {
      patchfox.go("errorHandler", "view", {message: vnode.state.error})
    }

    if (vnode.state.loadingPhase == "loaded" && vnode.state.msgs.length > 0) {
      return [
        // header,
        ...vnode.state.msgs.map(msg => m(MessageRenderer, { msg })), 
        m("br"), 
        m(".btn-group", [
          m("button.btn.btn-outline.btn-wide", { onclick: goPrevious }, "Previous"), 
          m("button.btn.btn-outline.btn-wide", { onclick: goNext }, "Next")]
        )]
    }

  },
}

module.exports = PublicView
