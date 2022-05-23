const ssbUri = require("ssb-uri2")
const pull = require("pull-stream")

// alias %+t5jU5cGas6V5Ksze+zIDkyoFBlfbD+PJVHiYELzDnM=.sha256

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
  },
  getAliases: (feed) => {
    return new Promise((resolve, reject) => {
      let sbot = ssb.sbot
      if (sbot) {
        if (!feed) {
          feed = sbot.id;
        }

        // fixme: room/alias msgs have an action "registered" or "revoked". This needs to be reduced.
        pull(
          sbot.createUserStream({
            id: feed,
          }),
          pull.filter(msg => msg?.value?.content?.type === "room/alias"),
          pull.map(msg => {
            console.log("mapping", msg)
            return {
              alias: msg?.value?.content?.alias,
              room: msg?.value?.content?.room,
              url: msg?.value?.content?.aliasURL
            }
          }),
          pull.collect(function (err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          })
        );
      } else {
        reject("no sbot");
      }
    });
  }
}

module.exports = rooms2
