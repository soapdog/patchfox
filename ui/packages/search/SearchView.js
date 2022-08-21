const m = require("mithril")
const { when } = require("../../core/kernel/utils.js")
const MessageRenderer = require("../../core/components/MessageRenderer.js")
const Spinner = require("../../core/components/Spinner.js")

const SearchView = {
  oninit: (vnode) => {
    vnode.state.shouldSearch = true
    vnode.state.msgs = []
    vnode.state.error = false
    vnode.state.abortable = false
  },
  onremove: (vnode) => {
    if (vnode.state.abortable) {
      return vnode.state.abortable.abort()
    }
  },
  view: (vnode) => {
    let query = vnode.attrs.query

    patchfox.title(`Search: ${query}`)

    console.log("searching for", query)

    const gotResult = ({msg, abortable}) => {
      vnode.state.abortable = abortable
      if (msg) {
        console.log("got a match", msg)
        vnode.state.msgs.push(msg)
        m.redraw()
        return true
      }
    }

    if (query[0] === "%") {
      patchfox.reload("hub", "thread", { thread: query })
    }

    if (query[0] === "@") {
      patchfox.reload("contacts", "profile", { feed: query })
    }

    if (query[0] === "#") {
      patchfox.reload("hub", "channel", { channel: query.slice(1) })
    }

    if (query[0] === "&") {
      window.open = patchfox.blobUrl(query)
    }

    if (vnode.state.shouldSearch) {
      ssb
        .searchWithCallback(query, gotResult)
        .then(() => {
          console.log("finished searching", vnode.state.msgs)
          vnode.state.shouldSearch = false
          m.redraw()
        })
        .catch((n) => {
          console.dir("error searching", n)
          vnode.state.error = n.message
          vnode.state.shouldSearch = false
          m.redraw()
        })
    }

    return [
      m(".container", m("h4", ["Search", m("small.label.hide-sm", query)])),
      when(
        vnode.state.error,
        m(
          ".alert.alert-error",
          m(
            "span.flex-1",
            `Couldn't find results for query '${query}' : ${vnode.state.error}`
          )
        )
      ),
      when(vnode.state.shouldSearch, m(Spinner)),
      when(
        !vnode.state.shouldSearch && !vnode.state.error,
        vnode.state.msgs.map((msg) => m(MessageRenderer, { msg }))
      ),
    ]
  },
}

module.exports = SearchView
