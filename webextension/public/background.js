const patchfox = {
  config: {
    server_discovery_url: "http://localhost:8989/get-address",
    debug: true,
    displayHostAppOutput: false
  },
  nativePort: false, // will contain the port to communicate with host app
  sbotConfig: {},// holds configuration from host_app (secret, keys, manifest)
  // debug routines, switch them off by toggling patchfox.config.debug
  log: (prefix, content, data) => {
    if (patchfox.config.debug) {
      console.log(`[${prefix}] ${content}`, data)
    }
  },
  debug: (content, data) => patchfox.log("[BACKGROUND - DEBUG]", content, data ? data : ""),
  info: (content, data) => patchfox.log("[BACKGROUND - INFO]", content, data ? data : ""),
  err: (content, data) => patchfox.log("[BACKGROUND - ERROR]", content, data ? data : ""),
  fromNative: (content, data) => patchfox.log("[NATIVE - DEBUG]", content, data ? data : ""),
  // Routines for starting and managing the host app
  startBundledServer: () => {
    patchfox.info("trying to start sbot using Native Messaging")

    patchfox.nativePort = browser.runtime.connectNative('patchfox')

    patchfox.nativePort.onMessage.addListener((response) => {
      if (patchfox.config.debug && patchfox.config.displayHostAppOutput) {
        patchfox.fromNative(response.type, response.msg)
      }
      switch (response.type) {
        case "shutdown":
          patchfox.info("server shutdown gracefuly")
          break
        case "config":
          patchfox.info("server sent configuration", response)
          patchfox.sbotConfig = {
            remote: response.remote,
            keys: response.keys,
            secret: response.secret,
            manifest: response.manifest
          }
          browser.storage.local.set(patchfox.sbotConfig)
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
  },
  // IPC Handlers
  IPCHandler: (request, sender, sendResponse) => {
    patchfox.debug("received call from content script", request)
    switch (request.cmd) {
      case "get-config":
        sendResponse({ type: "config", config: patchfox.sbotConfig })
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

const boot = () => {
  var getConfig = browser.storage.local.get();
  getConfig.then((config) => {
    if (!config.hasOwnProperty("secret") || !config.hasOwnProperty("remote")) {
      patchfox.startBundledServer()
    } else {
      patchfox.info("Configuration has been saved before, no need to launch local app")
      patchfox.sbotConfig = config
      var creating = browser.tabs.create({
        url: browser.extension.getURL("index.html")
      })
    }
  });

}

// Bind Handlers between content scripts and the background script
browser.runtime.onMessage.addListener(patchfox.IPCHandler)
browser.browserAction.onClicked.addListener(patchfox.browserActionHandler)

patchfox.info("starting")
boot()