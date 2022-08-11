const pull = require("pull-stream")

const system = {
  acceptInvite: invite => {
    return new Promise((resolve, reject) => {
      ssb.sbot.invite.accept(invite, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  },
  getPeers: () =>
    new Promise((resolve, reject) => {
      function getConnectedPeersNow(cb) {
        pull(
          ssb.sbot.conn.peers(),
          pull.map(entries => entries.filter(([addr, data]) => data.state === "connected")),
          pull.take(1), // This is important
          pull.drain(connectedPeers => cb(connectedPeers))
        )
      }

      getConnectedPeersNow(arr => resolve(arr))
    }),

  getStatus: () =>
    new Promise((resolve, reject) => {
      ssb.sbot.status((err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    }),
}

module.exports = system
