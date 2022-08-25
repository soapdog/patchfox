const m = require("mithril")
const pull = require("pull-stream")
const Spinner = require("../../core/components/Spinner.js")
const AvatarChip = require("../../core/components/AvatarChip.js")
const AvatarListing = require("../../core/components/AvatarListing.js")


const sbot = ssb.sbot

const PeersView = {
  oninit: vnode => {
    vnode.state.shouldLoad = true
    vnode.state.peerList = []
  },
  view: vnode => {
    if (vnode.state.shouldLoad) {
      ssb.system
        .getPeers()
        .then(data => {
          console.log("peers", data)
          vnode.state.shouldLoad = false
          vnode.state.peerList = data.map(arr => arr[1])
          m.redraw()
        })
        .catch(err => {
          throw err
        })
    }

    if (vnode.state.shouldLoad) {
      return m(Spinner)
    }

    return [
      m("h3.title", "Peer List"),
      m(AvatarListing, {feeds: vnode.state.peerList.map(peer => {
        return peer.key
      })})
    ]
  },
}

module.exports = PeersView
