/*
On startup, connect to the "sbot_native_app" app.
*/
var port = browser.runtime.connectNative('patchfox')
console.log('port', port)

/*
Listen for messages from the host app.
*/

port.onDisconnect.addListener(data => {
  console.log('disconnect', data)
})

port.onMessage.addListener(response => {
  if (response.type && response.type === "ping") {
    return
  }

  switch (response.type) {
    case 'server':
      browser.tabs.create({
        url: response.server //browser.extension.getURL('build/index.html')
      })
      break
    case 'debug':
      break
    default:
      console.log('Received: ', response)

  }
})

console.log('Sending start server')
port.postMessage({ cmd: 'start-server' })

const ipcHandler = (data) => {
  switch (data.type) {
    case "open-compose":
      browser.sidebarAction.setPanel(
        {
          panel: browser.extension.getURL('components/compose-window/index.html')
        }
      )
      browser.sidebarAction.setTitle({ title: 'Patchfox - Compose' })
      browser.sidebarAction.open()
      break
  }
}

browser.runtime.onMessage.addListener(ipcHandler)


// setTimeout(() => {
//   console.log("trying to quit process...")
//   port.postMessage({ cmd: "stop-server" })
// }, 12000)

// ssb:%Qrof3M7aLz75LMiCkvgEtF9J7TVBKDojG6ITq5mGNCQ=.sha256