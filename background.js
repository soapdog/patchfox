/*
On startup, connect to the "sbot_native_app" app.
*/
var port = browser.runtime.connectNative('patchfox')
console.log('port', port)

/*
Listen for messages from the app.
*/

port.onDisconnect.addListener(data => {
  console.log('disconnect', data)
})

port.onMessage.addListener(response => {
  if (response.type && response.type === "ping") {
    return
  }
  console.log('Received: ', response)

  switch (response.type) {
    case 'server':
      browser.tabs.create({
        url: browser.extension.getURL('build/index.html')
      })
      break
  }
})

console.log('Sending start server')
port.postMessage({ cmd: 'start-server' })

setTimeout(() => {
  console.log("trying to quit process...")
  port.postMessage({ cmd: "stop-server" })
}, 12000)


// ssb:%Qrof3M7aLz75LMiCkvgEtF9J7TVBKDojG6ITq5mGNCQ=.sha256