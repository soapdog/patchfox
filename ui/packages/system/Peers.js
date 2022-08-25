const m = require("mithril")
const pull = require("pull-stream")
const Spinner = require("../../core/components/Spinner.js")
const AvatarChip = require("../../core/components/AvatarChip.js")
const AvatarListing = require("../../core/components/AvatarListing.js")

const sbot = ssb.sbot

const PeersView = {
  oninit: (vnode) => {
    vnode.state.shouldLoad = true
    vnode.state.peerList = {}
  },
  view: (vnode) => {
    if (vnode.state.shouldLoad) {
      ssb.system
        .getPeers()
        .then((data) => {
          console.log("peers", data)
          vnode.state.shouldLoad = false
          
          vnode.state.peerList = {}
          
          data.forEach((arr) => {
            let key = arr[1]?.type || arr[1]?.inferredType || "unknown"
            if (!Array.isArray(vnode.state.peerList[key])) {
              vnode.state.peerList[key] = [arr[1]]
            } else {
              vnode.state.peerList[key].push(arr[1])
            }
          })
          
          m.redraw()
        })
        .catch((err) => {
          throw err
        })
    }

    if (vnode.state.shouldLoad) {
      return m(Spinner)
    }

    return [
      m("h3.uppercase.text-xl", "Peer List"),
      Object.keys(vnode.state.peerList).map((key) => {
        return m(".pt-4", [
          m("h1.uppercase.text-medium", key),
          m(AvatarListing, {
            feeds: vnode.state.peerList[key].map((peer) => {
              return peer.key
            }),
          }),
        ])
      }),
    ]
  },
}

module.exports = PeersView
