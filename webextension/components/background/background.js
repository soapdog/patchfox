const patchfox = {
  // Debugging routines...
  config: {
    server_discovery_url: "http://localhost:8989/get-address",
    debug: true
  },
  log: (prefix, content, data) => {
    if (patchfox.config.debug) {
      console.log(`[${prefix}] ${content}`, data)
    }
  },
  info: (content, data) => patchfox.log("[INFO]", content, data),
  err: (content, data) => patchfox.log("[ERROR]", content, data),
  // Server discovery/start routines...
  findServer: async () => {
    try {
      const response = await fetch(patchfox.config.server_discovery_url)
      if (response.status === 200) {
        const server = await response.text()
        patchfox.info("response", server)
        if (server.startsWith("ws://")) {
          localStorage.setItem("remote", server)
          patchfox.info("Found running server at:", server)
          return server
        }
      }
    } catch (n) {
      patchfox.err("something funky with network connection", n)
    }
    return false // patchfox.startBundledServer()
  },
  startBundledServer: async () => {
    // todo: use native messaging to connect to bundled server...
    patchfox.info("trying to start sbot using Native Messaging")
    const port = browser.runtime.connectNative('patchfox')
    return false
  }
}

var boot = async () => {
  localStorage.removeItem("remote")
  const server = await patchfox.findServer()

  console.log("s", server)
}

boot()
