const ssbUri = require("ssb-uri2")

/**
 * Protocol registration needs to happen at the main process and not the renderer.
 * Part of the code that makes custom protocols work will be in app.js on the event
 * that handles the app ready call.
 */

const interceptView = {
  oninit: vnode => {
    let query = vnode.attrs.query

    setTimeout(() => {
      // Experimental handling
      if (ssbUri.isExperimentalSSBURI(query)) {
        if (ssbUri.isExperimentalSSBURIWithAction("claim-http-invite")(query)) {
          // SSB Room 2.0 invite.
          patchfox.go("system", "joinRoom", { invite: query })
        }

        if (ssbUri.isExperimentalSSBURIWithAction("start-http-auth")(query)) {
          // SSB Room 2.0 http auth.
          throw "Can't handle Rooms 2.0 auth messages"
        }
      }

      if (ssbUri.isMessageSSBURI(query)) {
        let sigil = ssbUri.toMessageSigil(query)

        if (sigil[0] == "#") {
          patchfox.go("hub", "channel", { channel: sigil.slice(1) })
        } else {
          patchfox.go("hub", "thread", { thread: sigil })
        }
      }

      if (ssbUri.isFeedSSBURI(query)) {
        patchfox.go("contacts", "profile", { feed: ssbUri.toMessageSigil(query) })
      }

      if (ssbUri.isBlobSSBURI(query)) {
        window.location = `${patchfox.blobUrl(ssbUri.toMessageSigil(query))}`
      }
    }, 500)
  },
  view: vnode => {
    return m(".loading")
  },
}

module.exports = interceptView
