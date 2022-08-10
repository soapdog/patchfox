const m = require("mithril")
const stream = require("mithril/stream")
const AvatarMenuItem = require("./AvatarMenuItem.js")
const AvatarListing = require("./AvatarListing.js")
const { when } = require("../kernel/utils.js")

const VoteCounter = {
  oninit: vnode => {
    vnode.state.voters = []
    vnode.state.stage = "loading"

    ssb
      .votes(vnode.attrs.msg)
      .then(vs => {
        vnode.state.voters = vs
        vnode.state.stage = "loaded"
        m.redraw()
      })
      .catch(n => {
        vnode.state.error = n
        vnode.state.stage = "error"
        m.redraw()
      })
  },
  view: vnode => {
    let dropdownActive = false
    let error = vnode.state.error
    let voters = vnode.state.voters

    const loading = when(vnode.state.stage == "loading", m(".flex.justify-center", m("i.fas.fa-spinner.fa-spin")))

    const loadedSome = when(
      vnode.state.stage == "loaded" && voters.length > 0,
      m(".flex.justify-center", m(".dropdown", [
        m(
          "label.label",
          {
            class: dropdownActive ? "dropdown-open" : "",
            onclick: () => {
              dropdownActive = !dropdownActive
            },
            tabindex: 0,
          },
          `💜 ${voters.length}`
        ),
        m(".dropdown-content.menu.p-2.shadow.bg-base-100.rounded-box.justify-start.w-52", {style: {"max-height": "200px", overflow: "scroll"}}, voters.map(f => m(AvatarMenuItem, {feed: f}))),
      ]))
    )

    const loadedZero = when(vnode.state.stage == "loaded" && voters.length == 0, m(".flex.justify-center", `💜 ${voters.length}`))

    const cantLoad = when(vnode.state.stage == "error", m(".flex", `💔 can't load`))

    return m(".vote-counter.flex.content-center.items-center", [loading, loadedSome, loadedZero, cantLoad])
  },
}

module.exports = VoteCounter
