import m from "mithril"


const handleBackgroundResponse = async (data) => {
  console.log("handleBackgroundResponse", data)
  switch (data.type) {
    case "config":
      if (data.config.hasOwnProperty('secret')) {
        const keys = data.config.keys
        const remote = data.config.remote
        const manifest = data.config.manifest
        localStorage.setItem("config", JSON.stringify(data.config))

        ScuttleShellHandler.status = ("Received response from Scuttle Shell, wait for configuration test...")
        m.redraw()
        setTimeout(async () => {
          try {
            m.route.set("/setup-test")
          } catch (e) {
            console.error("problem launching app from background response", e)
          }
        }, 5000)

      }
      break
  }
}

const sendBackgroundCommand = async (cmd, data) => {
  console.log("sendBackgroundCommand", cmd, data)
  if (typeof browser !== "undefined") {
    try {
      let sending = await browser.runtime.sendMessage({ cmd, data })
      await handleBackgroundResponse(sending)
    } catch (e) {
      console.error("cant send background command", e)
    }
  } else {
    console.log("not an add-on, can't do background stuff")
    // need to launch patchfox with settings page.
  }
}

const openScuttleShellOrSettings = async () => {
  let config = JSON.parse(localStorage.getItem("config")) || {
    remote: "",
    keys: "",
    manifest: ""
  }
  config.keys = JSON.stringify(config.keys)
  config.manifest = JSON.stringify(config.manifest)

  if (typeof browser !== "undefined") {
    ScuttleShellHandler.status = "Wait while Scuttle Shell launches..."
    m.redraw()
    sendBackgroundCommand("start-scuttle-shell")
  } else {
    m.route.set("/setup")
  }
}

var ScuttleShellHandler = {
  oninit: () => {
    ScuttleShellHandler.status = "Starting Scuttle Shell..."
  },
  view: function (vnode) {
    setTimeout(openScuttleShellOrSettings, 2000)
    return m("h1", vnode.state.status)
  }
}

export default ScuttleShellHandler