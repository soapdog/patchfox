const m = require("mithril")
const ipcRenderer = require("electron").ipcRenderer

const ReindexingView = {
  oninit: vnode => {
    ipcRenderer.on("progress", (event, data) => {
      console.log("progress", data)
      let el = document.getElementById("progress")

      el.setAttribute("max", data.indexes.target)
      el.setAttribute("value", data.indexes.current)
    })
  },
  view: vnode => {
    return m(".prose.w-80.mx-auto", [
      m("center", [
        m("h1", "Reindexing"),
        m("img", {
          src: `${__dirname}/../../assets/images/patchfox_pixel_96.png`
        })
      ]),
      m("progress.progress.progress-info.w-80.mx-auto", {
        id: "progress",
        value: 0,
        max: 100
      })
    ])
  }
}

module.exports = ReindexingView
