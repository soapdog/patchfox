const ipcRenderer = require("electron").ipcRenderer

ipcRenderer.on("progress", (event, data) => {
  console.log("progress", data)
  let el = document.getElementById("progress")

  el.setAttribute("max", data.indexes.target)
  el.setAttribute("value", data.indexes.current)
})
