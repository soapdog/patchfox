const patchfox = {
  config: {
    server_discovery_url: "http://localhost:8989/get-address",
    debug: true,
    displayHostAppOutput: false
  },
  nativePort: false, // will contain the port to communicate with host app
  // debug routines, switch them off by toggling patchfox.config.debug
  log: (prefix, content, data) => {
    if (patchfox.config.debug) {
      console.log(`[${prefix}] ${content}`, data)
    }
  },
  debug: (content, data) => patchfox.log("[DEBUG]", content, data ? data : ""),
  info: (content, data) => patchfox.log("[INFO]", content, data ? data : ""),
  err: (content, data) => patchfox.log("[ERROR]", content, data ? data : ""),
  // Server discovery/start routines...
  findServer: async () => {
    try {
      const response = await fetch(patchfox.config.server_discovery_url)
      patchfox.debug("response from server discovery", response)
      const data = await response.json()
      patchfox.info("response", data)
      switch (data.status) {
        case "granted":
          browser.storage.local.set({ "remote": data.server })
          patchfox.info("Found running server at:", data.server)
          return data.server
          break
        case "pending":
          patchfox.info(`sbot wants us to try again in ${data.retry} seconds`)
          setTimeout(boot, data.retry)
          return false
          break
        case "denied":
          patchfox.info("Sbot doesn't like patchfox and denied access.")
          browser.storage.local.remove("remote") // respect sbot wishes and remove any set remote
          return false
          break
      }
    } catch (n) {
      patchfox.err(`something funky with network connection\nwill try launching sbot native app`, n)
    }
    return patchfox.startBundledServer()
  },
  // Routines for starting and managing the host app
  startBundledServer: async () => {
    patchfox.info("trying to start sbot using Native Messaging")
    patchfox.nativePort = browser.runtime.connectNative('patchfox')
    patchfox.nativePort.onMessage.addListener((response) => {
      if (patchfox.config.debug && patchfox.config.displayHostAppOutput) {
        patchfox.debug(response.type, response.msg)
      }
      switch (response.type) {
        case "up":
          patchfox.info("server is up, will try server discovery in", response.retry)
          setTimeout(boot, response.retry)
        case "server":
          browser.storage.local.set({ "remote": response.server })
          break
        case "shutdown":
          patchfox.info("server shutdown gracefuly")
          break
      }
    })
    patchfox.nativePort.onDisconnect.addListener((p) => {
      if (p.error) {
        patchfox.err(`Disconnected due to an error`, p.error.message)
        patchfox.nativePort = false
        setTimeout(patchfox.startBundledServer, 3000) // sbot tray app needs some seconds to clean up when it dies.
      }
    })
    patchfox.nativePort.postMessage({ cmd: "start-server" })
    return false
  },
  // IPC Handlers
  IPCHandler: (request, sender, sendResponse) => {
    patchfox.debug("received call from content script", request)
    switch (request.cmd) {
      case "get-remote":
        browser.storage.local.get()
          .then(data => sendResponse({ type: "config", config: data }))
        break
    }
    return true

  },
  // Browser action handler
  browserActionHandler: (ev) => {
    var creating = browser.tabs.create({
      url: browser.extension.getURL("index.html")
    })
  }
}


// Initiate the whole process. Will be called again if the server requests.
var boot = async () => {
  patchfox.info("Patchfox doing service discovery...")
  const server = await patchfox.findServer()

  if (server) {
    patchfox.info("server exists, extension is ready")
  }
}

// Bind Handlers between content scripts and the background script
browser.runtime.onMessage.addListener(patchfox.IPCHandler)
browser.browserAction.onClicked.addListener(patchfox.browserActionHandler)

boot()
