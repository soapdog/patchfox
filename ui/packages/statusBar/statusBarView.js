const m = require("mithril")
const { when } = require("../../core/kernel/utils.js")
const AvatarChip = require("../../core/components/AvatarChip.js")

/**
WARNING: Be aware that many functions here make direct DOM access. That has
been coded that way so that the status bar can update its content without causing
a VDOM redraw.
*/

const checkIndexing = vnode => {
  vnode.state.loading = true
  ssb.sbot.progress().then((data, err) =>{
    vnode.state.data = data
    vnode.state.loading = false
    let reindexingDiv = document.getElementById("reindexing-div")
    if (data.indexes.current !== data.indexes.target) {
      let progressBar = document.getElementById("reindexing-progress-bar")
      progressBar.setAttribute("value", data.indexes.current)
      progressBar.setAttribute("max", data.indexes.target)
      
      reindexingDiv.classList.remove("hidden")
    } else {
      reindexingDiv.classList.add("hidden")
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
        document.getElementById("peer-count").innerText = `${vnode.state.peers.length} peers`
      }
    })
}

const StatusBarView = {
  oninit: vnode => {
    vnode.state.loading = true
    vnode.state.peers = []
    setInterval(() => checkIndexing(vnode), 300)
    setInterval(() => countPeers(vnode), 300)

  },
  view: vnode => {
    let currValue = 0
    let endValue = 0 

    if (!vnode.state.loading) {
      currValue = vnode.state.data.indexes.current
      endValue = vnode.state.data.indexes.target
    }

    return m(".flex.w-full.items-center.fixed.z-50.bottom-0.bg-accent.text-accent-content", [
      m(AvatarChip, {feed: ssb.feed, inline: true}),
      m(".flex.hidden#reindexing-div", [
        m("span", "Reindexing..."),
        m("progress.progress.progress-primary.w-8#reindexing-progress-bar", {value: currValue, max: endValue})
      ]),
      m(".btn.btn-sm.btn-ghost#peer-count",{onclick: () => patchfox.go("system", "peers")}, `${vnode.state.peers.length} peers`)
    ])
  },
}

module.exports = StatusBarView
