const m = require("mithril")
const { when } = require("../../core/kernel/utils.js")
const AvatarChip = require("../../core/components/AvatarChip.js")

const checkIndexing = vnode => {
  vnode.state.loading = true
  ssb.system.getStatus().then(data => {
    vnode.state.data = data
    vnode.state.loading = false
    if (data.progress.indexes.current !== data.progress.indexes.target) {
      m.redraw()
    }
  })
}

const countPeers = (vnode) => {
  let currentPeers = vnode.state.peers
  ssb.system
    .getPeers()
    .then(data => {
      vnode.state.peers = data
      if (currentPeers.length !== data.length) {
        document.getElementById("peer-count").innerText = `• ${vnode.state.peers.length} peers`
      }
    })
}

const StatusBarView = {
  oninit: vnode => {
    vnode.state.loading = true
    vnode.state.peers = []
    setInterval(() => checkIndexing(vnode), 5000)
    setInterval(() => countPeers(vnode), 300)

  },
  view: vnode => {
    let currValue = 0
    let endValue = 0 

    if (!vnode.state.loading) {
      currValue = vnode.state.data.progress.indexes.current
      endValue = vnode.state.data.progress.indexes.target
    }

    return m(".flex.w-full.items-center.fixed.z-50.bottom-0.bg-accent.text-accent-content", [
      m(AvatarChip, {feed: ssb.feed, inline: true}),
      when(currValue !== endValue, m(".flex", [
        m("span", "Reindexing..."),
        m("progress.progress.progress-primary.w-56", {value: currValue, max: endValue})
      ])),
      m("span#peer-count", `• ${vnode.state.peers.length} peers`)
    ])
  },
}

module.exports = StatusBarView
