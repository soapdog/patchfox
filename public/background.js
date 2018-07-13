// TODO: Reorganize flux, more than one copy starting...

const patchfox = {
  config: {
    debug: true,
    displayHostAppOutput: true
  },
  nativePort: false, // will contain the port to communicate with host app
  sbotConfig: {},// holds configuration from host_app (secret, keys, manifest)
  // debug routines, switch them off by toggling patchfox.config.debug
  log: (prefix, content, data) => {
    if (patchfox.config.debug) {
      console.log(`[${prefix}] ${content}`, data)
    }
  },
  errorCount: 0,
  debug: (content, data) => patchfox.log("[BACKGROUND - DEBUG]", content, data ? data : ""),
  info: (content, data) => patchfox.log("[BACKGROUND - INFO]", content, data ? data : ""),
  err: (content, data) => patchfox.log(`[BACKGROUND - ERROR] ${patchfox.errorCount}:`, content, data ? data : ""),
  fromNative: (content, data) => patchfox.log("[NATIVE - DEBUG]", content, data ? data : ""),
  // Routines for starting and managing the host app
  startBundledServer: (cb) => {
    patchfox.info("trying to start sbot using Native Messaging")

    patchfox.nativePort = browser.runtime.connectNative('scuttleshell')

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
          cb()
          break
      }
    })

    patchfox.nativePort.onDisconnect.addListener((p) => {
      if (p.error) {
        patchfox.errorCount++
        patchfox.err(`Disconnected due to an error`, p.error.message)
        patchfox.nativePort = false
        if (patchfox.errorCount < 2) {
          setTimeout(patchfox.startBundledServer, 2000) // sbot tray app needs some seconds to clean up when it dies.
        } else {
          // can't really start the native app
          patchfox.errorCount = 0
          openTroubleshootingPage()
        }
      }
    })

    patchfox.nativePort.postMessage({ cmd: "start-server" })
  },
  // IPC Handlers
  IPCHandler: (request, sender, sendResponse) => {
    patchfox.debug("received IPC call from content script", request)
    switch (request.cmd) {
      case "get-config":
        if (patchfox.sbotConfig.hasOwnProperty("remote")) {
          sendResponse({ type: "config", config: patchfox.sbotConfig })
        } else {
          getConfig()
          sendResponse({ type: "config", config: {} }) // signals no config yet
        }
        break
      case "start-native-app":
        patchfox.startBundledServer(() => {
          sendResponse({ type: "native-app", msg: "started" })
        })
        break
      case "problem-no-config":
      case "problem-no-sbot":
        openTroubleshootingPage()
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

const getConfig = () => {
  var config = browser.storage.local.get();
  config.then((config) => {
    if (!config.hasOwnProperty("secret") || !config.hasOwnProperty("remote")) {
      patchfox.info("Configuration was not found")
      patchfox.startBundledServer()
    } else {
      patchfox.info("Configuration has been saved before, no need to launch local app", config)
      patchfox.sbotConfig = config
    }
  });

}

function openTroubleshootingPage() {
  openPage('problems.html')
}

function openPage(page) {
  patchfox.errorCount = 0
  return browser.tabs.create({
    url: browser.extension.getURL(page)
  });
}

// Bind Handlers between content scripts and the background script
browser.runtime.onMessage.addListener(patchfox.IPCHandler)
browser.browserAction.onClicked.addListener(patchfox.browserActionHandler)

patchfox.info("background loaded")


