// Code adapted from ssb-ahoy
// URL: https://github.com/ssbc/ssb-ahoy/

const secretStack = require("secret-stack")
const caps = require("ssb-caps")
const merge = require("deep-extend")
const { join } = require("path")
let config = require("ssb-config")

function buildConfig(identity, plugins, userConfig = {}) {

  config.keys = identity.keys
  config.remote = identity.remote
  config = addSockets(config, plugins)
  config = fixLocalhost(config)
  config = forceLocalhost(config)

  return config
}

function addSockets(config, plugins) {
  if (process.platform === "win32") return config

  const hasSocketPlugins = plugins.find(plugin => plugin.name === "unix-socket") && plugins.find(plugin => plugin.name === "no-auth")
  if (!hasSocketPlugins) return config

  const pubkey = config.keys.id.slice(1).replace(`.${config.keys.curve}`, "")
  return merge(config, {
    connections: {
      incoming: { unix: [{ scope: "device", transform: "noauth", server: true }] },
    },
    remote: `unix:${join(config.path, "socket")}:~noauth:${pubkey}`, // overwrites
  })
}

function fixLocalhost(config) {
  if (process.platform !== "win32") return config

  //  host values default to :: which seems to break Windows 10

  const unsafe = "::"
  const safe = "127.0.0.1"
  if (config.connections.incoming.net[0].host === unsafe) {
    config.connections.incoming.net[0].host = safe
  }

  if (config.connections.incoming.ws[0].host === unsafe) {
    config.connections.incoming.ws[0].host = safe
  }

  if (config.host === unsafe) {
    config.host = safe
  }

  return config
}

function forceLocalhost(config) {
  const safe = "127.0.0.1"
  config.connections.incoming.net[0].host = safe

  config.connections.incoming.ws[0].host = safe

  config.host = safe

  return config
}

function startSSB(plugins, config, cb) {
  console.log("Starting Server")

  const stack = secretStack({ caps: config.caps || caps })
  plugins.forEach(plugin => {
    console.log(`Loading plugin ${plugin.name}`)
    stack.use(plugin)
  })

  const ssb = stack(config)

  console.log("Knock! Knock! Is there a server there?")

  const checkServer = () => {
    let res = ssb.progress()

    if (res.hasOwnProperty("indexes")) {
      cb(null, ssb)
    } else {
      console.log("looping")
      setTimeout(checkServer, 1000)
    }

  }

  setTimeout(checkServer, 1000)
}

function startDefaultPatchfoxServer(identity, cb) {
  const plugins = [
    // Authentication often hooked for authentication.
    require("ssb-master"),
    // Methods often used during init().
    require("ssb-db"),
    require("ssb-ebt"),
    require("ssb-friends"),
    // Method `replicate()` often hooked for improvements.
    require("ssb-replicate"),
    require("ssb-replication-scheduler"),
    // Required by ssb-about, ssb-tangle, etc.
    require("ssb-backlinks"),
    // Required by ssb-room
    require("ssb-conn"),
    require("ssb-about"),
    require("ssb-blobs"),
    require("ssb-invite-client"),
    require("ssb-lan"),
    require("ssb-logging"),
    require("ssb-meme"),
    require("ssb-no-auth"),
    require("ssb-onion"),
    require("ssb-ooo"),
    require("ssb-plugins"),
    require("ssb-private"),
    require("ssb-private1"),
    require("ssb-query"),
    require("ssb-room/tunnel/client"),
    require("ssb-search"),
    require("ssb-unix-socket"),
    require("ssb-ws"),
  ]

  const config = buildConfig(identity, plugins)

  startSSB(plugins, config, cb)
}

console.log("hello there")
