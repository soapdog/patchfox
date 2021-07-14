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
  }
}

module.exports = system
