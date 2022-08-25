const m = require("mithril")
const MessageRenderer = require("../../core/components/MessageRenderer.js")
const Spinner = require("../../core/components/Spinner.js")
const { when } = require("../../core/kernel/utils.js")

const PostsView = {
  oninit: (vnode) => {
    let feed = vnode.attrs.feed

    vnode.state.loading = true

    vnode.state.lastMsgs = []

    ssb
      .query(
        {
          value: {
            author: feed,
          },
        },
        10
      )
      .then((msgs) => {
        vnode.state.lastMsgs = msgs

        window.scrollTo(0, 0)
        vnode.state.loading = false
        m.redraw()
      })
  },
  view: (vnode) => {
    const loadMoreMessages = (lt) => {
      vnode.state.loading = true
      ssb
        .query({
          value: {
            author: feed,
            timestamp: { $lt: lt },
          },
        })
        .then((msgs) => {
          vnode.state.lastMsgs = msgs
          window.scrollTo(0, 0)
          vnode.state.loading = false
          m.redraw()
        })
    }

    if (vnode.state.loading) {
      return m(Spinner)
    } else {
      return [
        when(
          vnode.state.lastMsgs.length > 0,
          vnode.state.lastMsgs.map((msg) => m(MessageRenderer, { msg }))
        ),
        when(
          vnode.state.lastMsgs.length == 0,
          m("p", "You don't have messages from this user in your database.")
        ),
      ]
    }
  },
}

module.exports = PostsView
