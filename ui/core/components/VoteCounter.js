const m = require("mithril")
const stream = require("mithril/stream")
const AvatarMenuItem = require("./AvatarMenuItem.js")
const AvatarContainer = require("./AvatarContainer.js")
const AvatarChip = require("./AvatarChip.js")
const { when } = require("../kernel/utils.js")

const VoteCounter = {
  oninit: (vnode) => {
    this.state = "waitclick" // "loading", "loaded", "error"
  },
  view: (vnode) => {
    const onclick = vnode.attrs.onclick
    let msg = vnode.attrs.msg
    let dropdownActive = false
    let error = ""
    let voters = []

    const loadVotes = () => {
      state = "loading"
      ssb
        .votes(msg)
        .then((vs) => {
          voters = vs
          vnode.state.state = "loaded"
          m.redraw()
        })
        .catch((n) => {
          error = n
          vnode.state.state = "error"
          m.redraw()
        })
    }

    const avatarClick = (ev) => {
      let feed = ev.detail.feed
      let name = ev.detail.name

      patchfox.go("contacts", "profile", { feed })
    }

    if (vnode.state.state == "waitclick") {
      setTimeout(loadVotes, 500)
    }

    const loading = when(
      vnode.state.state == "loading",
      m(".flex.justify-center", m("i.fas.fa-spinner.fa-spin"))
    )

    const loadedSome = when(
      vnode.state.state == "loaded" && voters.length > 0,
      m(".dropdown", [
        m(
          "label.btn.btn-link",
          {
            classes: dropdownActive ? "dropdown-open" : "",
            onclick: () => {
              dropdownActive = !dropdownActive
            },
            tabindex: 0,
          },
          `💜 ${voters.length}`
        ),
        m(
          ".dropdown-content.menu.p-2.shadow.bg-base-100.rounded-box.w-52",
          m(
            AvatarContainer,
            voters.map((user) => {
              return m(
                "li",
                m(AvatarChip, {
                  feed: user,
                  onclick: avatarClick,
                })
              )
            })
          )
        ),
      ])
    )

    const loadedZero = when(
      vnode.state.state == "loaded" && voters.length == 0,
      m("span", `💜 ${voters.length}`)
    )

    const error = when(vnode.state.state == "error", m("span", `💔 can't load`))

    const waiting = when(
      vnode.state.state == "waitclick",
      m("span.c-hand.text-primary", { onclick: loadVotes }, "(get votes)")
    )

    return m(".vote-counter", [loading, loadedSome, loadedZero, error, waiting])
  },
}

module.exports = VoteCounter
