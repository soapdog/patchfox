const system = {
  acceptInvite: (invite) =>  {
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
  getPeers: () => new Promise((resolve, reject) => {
    ssb.sbot.gossip.peers((err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  }),
  getStatus: () => new Promise((resolve, reject) => {
    ssb.sbot.status((err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

module.exports = system
