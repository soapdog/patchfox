const m = require("mithril")
const Spinner = require("../../core/components/Spinner.js")
const { when } = require("../../core/kernel/utils.js")
const ssbUri = require("ssb-uri2")

const HttpAuthView = {
  oninit: (vnode) => {
    vnode.state.busy = false
    vnode.state.uri = vnode.attrs.uri || ""
    vnode.state.error = false
    vnode.state.msg = ""

    const startAuthenticationDance = () => {
      vnode.state.error = false
      vnode.state.msg += `* Attempting to authenticate...\n`
      vnode.state.busy = true

      ssb.rooms2
        .authenticateWithURI(uri)
        .then((data) => {
          console.log("data", data)
          vnode.state.msg = JSON.stringify(data)
          vnode.state.busy = false
          m.redraw()
        })
        .catch((n) => {
          vnode.state.error = true
          vnode.state.busy = false
          console.log("error", n)
          m.redraw()
        })
    }

    if (ssbUri.isExperimentalSSBURIWithAction("start-http-auth")(uri)) {
      // loaded with room 2.0 invite
      startAuthenticationDance()
    }
  },
  view: (vnode) => {
    return [
      m("h1.title", "Authenticating SSB with HTTP"),
      m(
        ".container",
        m(".content", [
          m(".prose", m.trust(ssb.markdown(vnode.state.msg))),
          when(loading, m(Spinner)),
        ])
      ),
    ]
  },
}
module.exports = HttpAuthView
