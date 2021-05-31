const ssbUri = require("ssb-uri2")

const rooms2 = {
  claimInvite: (invite) => {
    return new Promise((resolve, reject) => {
      ssb.sbot.httpInviteClient.claim(invite, (err, address) => {
        if (err) {
          reject(err)
        } else {
          resolve(address)
        }
      })
    })
  },
  connectAndRemember: (address) => {
    return new Promise((resolve, reject) => { 
      ssb.sbot.conn.connect(address, (err, data) => {
        if (err) {
          reject(err)
        } else {
          ssb.sbot.conn.remember(address)
          resolve({address, data})
        }
      })
    })
  },
  authenticateWithURI: (uri) => {
    return new Promise((resolve, reject) => {
      ssb.sbot.httpAuthClient.consumeSignInSsbUri(uri, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
}

module.exports = rooms2
