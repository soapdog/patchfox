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

const StatusBarView = {
  oninit: vnode => {
    vnode.state.loading = true
    setInterval(() => checkIndexing(vnode), 5000)
  },
  view: vnode => {
    let currValue = 0
    let endValue = 0 

    if (!vnode.state.loading) {
      currValue = vnode.state.data.progress.indexes.current
      endValue = vnode.state.data.progress.indexes.target
    }

    return m(".flex.w-full.fixed.z-50.bottom-0.bg-accent.text-accent-content", [
      m(AvatarChip, {feed: ssb.feed, inline: true}),
      when(currValue !== endValue, m(".flex", [
        m("span", "Reindexing..."),
        m("progress.progress.progress-primary.w-56", {value: currValue, max: endValue})
      ]))
    ])
  },
}

module.exports = StatusBarView
