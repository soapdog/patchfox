/**
 * Code reworked from Perihelion server by Nico.
 * 
 * Original source: https://github.com/nsantini/perihelion
 */ 

const SecretStack = require("secret-stack")
const Config = require("ssb-config/inject")
const caps = require("ssb-caps")
const lori = require("lori")
const path = require("path")
const fs = require("fs-extra")
const {pathForIdentity, configurationForIdentity} = require("./common/identities.js")

let servers = 0

function serverForIdentity(feedid) {
  if (!Array.isArray(global._ssbServers)) {
    global._ssbServers = []
  }

  if (global._ssbServers[feedid]) {
    return global._ssbServers[feedid]
  }

  const folder = pathForIdentity(feedid)
  const secret = path.join(folder, "secret")

  if (!fs.existsSync(secret)) {
    lori.error(`Secret not found for ${feedid}.`)
    return false
  }
  
  
  process.on("uncaughtException", function (err) {
    console.log(err)
    lori.error(err)
  })

  const port = 26831 + servers 
  servers = servers + 1

  const ssb = SecretStack({ caps })
    // Core
    .use(require("ssb-master"))
    .use(require("ssb-db2"))
    .use(require("ssb-db2/compat"))
    .use(require("ssb-db2/about-self")) // include index
    // Replication
    .use(require("ssb-ebt")) // needs: db2/compat
    .use(require("ssb-friends")) // needs: db2
    .use(require("ssb-replicate"))
    .use(require("ssb-replication-scheduler")) // needs: friends, ebt
    // Connections
    .use(require("ssb-conn"))
    .use(require("ssb-lan"))
    .use(require("ssb-room-client")) // needs: conn
    .use(require("ssb-http-auth-client")) // needs: conn
    .use(require("ssb-http-invite-client"))
    .use(require("ssb-invite-client")) // needs: db2, conn
    // Queries
    .use(require("ssb-threads")) // needs: db, db2, friends
    // .use(require('ssb-search2')) // needs: db2
    .use(require("ssb-blobs"))

  const ssbConfig = Config("patchfox", {
    path: folder,
    db2: {
      automigrate: true,
      dangerouslyKillFlumeWhenMigrated: true,
    },
    replicate: {
      legacy: true,
      fallback: true,
    },
    connections: {
      incoming: {
        net: [{ scope: "private", transform: "shs", port: port }],
        channel: [{ scope: "device", transform: "noauth" }],
        bluetooth: [{ scope: "public", transform: "shs" }],
        tunnel: [{ scope: "public", transform: "shs" }],
      },
      outgoing: {
        net: [{ transform: "shs" }],
        ws: [{ transform: "shs" }],
        bluetooth: [{ scope: "public", transform: "shs" }],
        tunnel: [{ transform: "shs" }],
      },
    },
  })

  global._ssbServers[feedid] = ssb(ssbConfig);

  // Connect to pubs
  const connectToPubs = () => {
    global._ssbServers[feedid].conn.dbPeers().forEach(([addr, data]) => {
      if (data.type === "pub" && data.autoconnect) {
        lori.debug(`Connecting to Pub ${data.name}: ${data.key}`)
        global._ssbServers[feedid].conn.connect(addr, (err, connData) => {
          if (err) console.error(err);
          else {
            console.log("Connected", connData.id);
          }
        })
      }
    })
  }

  setTimeout(connectToPubs, 5000)

  lori.info(`SSB server for ${feedid} on port ${port}`)

  return global._ssbServers[feedid]
}

module.exports = serverForIdentity
