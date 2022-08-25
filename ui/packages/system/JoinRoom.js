const m = require("mithril")
const { when } = require("../../core/kernel/utils.js")
const ssbUri = require("ssb-uri2")

const JoinRoomView = {
  oninit: (vnode) => {
    vnode.state.joining = false
    vnode.state.error = false
    vnode.state.msg = ""
    let invite = vnode.attrs.invite

    const claimInvite = () => {
      vnode.state.error = false
      vnode.state.msg += `* Attempting to claim invite...\n`
      vnode.state.joining = true

      m.redraw()

      return ssb.rooms2.claimInvite(invite)
    }

    const connectAndRemember = () => {
      ssb.rooms2
        .connectAndRemember(address)
        .then(() => {
          vnode.state.joining = false
          vnode.state.msg += `* Connected to room at \`${address}\`.\n\nDone! Welcome to the marvelous world of Rooms 2.0.`
          m.redraw()
        })
        .catch((n) => {
          vnode.state.error = true
          vnode.state.joining = false
          console.log("error connecting to room 2.0", n)

          if (n.message.indexOf("is already on the list") !== -1) {
            vnode.state.msg += `* Error: you already joined this room.\n`
            m.redraw()
          } else if (n.message.indexOf("item not found: invite") !== -1) {
            vnode.state.msg += `* Error: that invite code has already been used.\n`
            m.redraw()
          } else if (n.message) {
            vnode.state.msg += `* Error: ${n.message}.\n`
            m.redraw()
          } else {
            patchfox.go("errorHandler", {
              currentPackage: patchfox.packages["system"],
              error: n,
            })
          }
        })
    }

    if (ssbUri.isExperimentalSSBURIWithAction("claim-http-invite")(invite)) {
      // loaded with room 2.0 invite
      claimInvite().then(connectAndRemember)
    }
  },
  view: (vnode) => {
    patchfox.title("Joining Room 2.0")

    return [
      m("h1.title", "Joining Room 2.0"),
      m(
        ".container",
        m(".content", [
          m(".prose", m.trust(ssb.markdown(vnode.state.msg))),
          when(vnode.state.loading, m(Spinner)),
        ])
      ),
    ]
  },
}
module.exports = JoinRoomView
