const m = require("mithril")
const pull = require("pull-stream")
const Spinner = require("../../core/components/Spinner.js")

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
          console.log("data", data)
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
      m("h4.title", "Peer List"),
      m("table.table.table-stripped.table-scroll", [
        m("thead", m("tr"), [m("th", "Host"), m("th", "Port"), m("th", "Key")]),
        m(
          "tbody",
          vnode.state.peerList.map(peer =>
            m("tr", [
              m("td", peer.host || peer.name || peer.key),
              m("td", peer.port),
              m(
                "td",
                m(
                  "a",
                  {
                    href: patchfox.url("contacts", "profile", {
                      feed: peer.key,
                    }),
                    onclick: ev => {
                      ev.preventDefault()
                      patchfox.go("contacts", "profile", { feed: peer.key })
                    },
                  },
                  peer.key
                )
              ),
            ])
          )
        ),
      ]),
    ]
  },
}

module.exports = PeersView
