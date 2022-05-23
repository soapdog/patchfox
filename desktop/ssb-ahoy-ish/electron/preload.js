const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('ahoy', {
  getConfig () {
    return ipcRenderer.invoke('get-config')
  }
})

// in ui window this exposes a safe API that can be called like
//
// ```js
// window.ahoy.getConfig()
//   .then(config => {
//
//   })
// ```
