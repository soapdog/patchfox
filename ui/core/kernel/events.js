const PubSub = require("pubsub-js")
const { shell, ipcRenderer } = require("electron")


const unloadEventUrlOpen = PubSub.subscribe("url:open", (msg, data) => {
  if (!data.startsWith("/")) {
    shell.openExternal(data)
  } else {
    window.open(data)
  }
})

PubSub.subscribe("documentation:open", (msg, data) => {
  window.open(patchfox.docsUrl(data))
})

ipcRenderer.on("patchfox:event", (ev, {event, data}) => {
  patchfox.emit(event, data)
})

module.exports = {
  unloadEventUrlOpen
}
