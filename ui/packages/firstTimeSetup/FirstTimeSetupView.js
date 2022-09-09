const m = require("mithril")
const fs = require("fs")
const path = require("path")
const ssbKeys = require("ssb-keys")
const ssbRef = require("ssb-ref")
const ssbMarkdown = require("ssb-markdown")
const os = require("os")
const ipcRenderer = require("electron").ipcRenderer
const {
  preferencesFileExists,
  initialisePreferencesFileIfNeeded,
  setPref,
  saveIdentityConfiguration,
  setDefaultIdentity
} = require("../../core/kernel/prefs.js")
const {
  when
} = require("../../core/kernel/utils.js")
let currentStep


const startMainWindow = () => {
  ipcRenderer.send("setup:done")
}

const md = text => {
  return m.trust(ssbMarkdown.block(text))
}

const ExistingInstallation = {
  // to be honest, this view should never appear.
  // `app.js` should detect an existing installation
  // and skip FTU.
  //
  // The component is here just to make sure that if
  // the user end up here with an already installed Patchfox
  // that we're able to show them something.
  view: vnode => {
    return [
      m("p", `Patchfox is already installed.`),
      m("button.btn", {
        onclick: startMainWindow
      }, "Start Patchfox")
    ]
  }
}

const CustomKeys = {
  // This use case is focused on advanced users that want to
  // run their own SSB server.
  //
  // In this case, Patchfox asks them for keys and a remote.
  oninit: vnode => {
    vnode.state.keys = false
    vnode.state.remote = ""
  },
  view: vnode => {
    let enabled = vnode.state.remote.length > 0 && vnode.state.keys

    const selectedFile = ev => {
      const secretFile = ev.target.files[0]
      const reader = new FileReader()
      reader.onload = function (evt) {
        const contents = evt.target.result
        let secret = contents.split("\n").filter(function (line) {
          return line.indexOf("#") != 0
        })
        secret = JSON.parse(secret.join("\n"))
        vnode.state.remote = `net://localhost:8008~shs:${secret.id.slice(1, secret.id.indexOf("=") + 1)}`
        vnode.state.keys = secret

        m.redraw()
      }
      reader.readAsText(secretFile)
    }

    return [
      m("p.prose", md(`
You need to provide a **secret** and a **remote**. Use this option
if you want to run your own SSB server, such as when using Patchfox
at the same time as another SSB application (i.e. Patchwork) or invoking
**ssb-server** manually.

You can also use this option to run a server on a remote machine and 
connect Patchfox to it.
      `)),
      m(".form-control",
        m("label.label", m("span.label-text", "Secret")),
        m("input", {
          type: "file",
          onchange: selectedFile
        })
      ),
      when(vnode.state.keys, m("span.badge.badge-outline", vnode.state.keys.id)),
      m(".form-control",
        m("label.label", m("span.label-text", "Remote")),
        m("input.input.input-bordered", {
          type: "text",
          name: "remote",
          value: vnode.state.remote
        })
      ),
      m("button.btn.mt-4", {
        onclick: () => {
          currentStep = vnode.state.preferencesFileExists ? steps["ExistingInstallation"] : steps["NewInstallation"]
        }
      }, "Go back"),
      m("button.btn.btn-primary.mt-4.ml-4", {
        disabled: !enabled,
        onclick: startMainWindow
      }, "Start Patchfox"),
    ]
  }
}

const NewInstallation = {
  // Be aware that this is called `NewInstallation` not because it is a
  // new SSB installation, but because it is a new Patchfox install on
  // a machine that is already running some SSB client.
  oninit: vnode => {
    vnode.state.useIdentity = true
    vnode.state.startServer = true

    let localKeysPath = path.join(os.homedir(), ".ssb", "secret")

    if (fs.existsSync(localKeysPath)) {
      // SSB already installed and in use.
      vnode.state.ssbInstalled = true
      vnode.state.keys = ssbKeys.loadOrCreateSync(localKeysPath)
    } else {
      // Brand new SSB user.
      vnode.state.ssbInstalled = false
    }
  },
  view: vnode => {
    // New user
    if (vnode.state.ssbInstalled === false) {
      return m(".prose", [
        m("p", `Welcome to Patchfox. The app will start shortly.`)
      ])
    }
    // SSB user
    const makeToggle = (label, checked, onclick) => {
      return m(".form-control", [
        m("label.label.cursor-pointer", [
          m("span.label-text", label),
          m("input.toggle", {
            type: "checkbox",
            checked,
            onclick
          })
        ])
      ])
    }

    const setUserIdentity = ev => {
      vnode.state.useIdentity = ev.target.checked

      if (!ev.target.checked) {
        vnode.state.startServer = false
      }
    }

    const setServerStart = ev => {
      vnode.state.startServer = ev.target.checked
    }

    const nextStep = () => {
      if (vnode.state.useIdentity) {
        // Happy path: The user has SSB installed and want to use
        // the same identity with Patchfox.
        //
        // This will be the most common case since most Patchfox
        // users are coming from other clients.
        let keys = vnode.state.keys
        let remote = `net:127.0.0.1:8008~shs:${keys.id.slice(1, keys.id.indexOf("=") + 1)}`
        initialisePreferencesFileIfNeeded()
        saveIdentityConfiguration({
          keys,
          remote,
          type: "nodejs-db1",
          startServer: vnode.state.startServer
        })

        setDefaultIdentity(vnode.state.keys.id)

        startMainWindow()
      } else {
        // This case is less common. The user doesn't want to use
        // the local key they have installed.
        //
        // The most common use case for this is to connect to a
        // remote server they're running on a VPS or by hand. In this
        // case, we'll record the keys and not start a server.
        //
        // In this case, we need to ask for a key and a remote to use.

        currentStep = steps["CustomKeys"]
      }
    }

    return [
      m("p.prose", [
        `Patchfox found an existing SSB identity:`,
        m("br"),
        m(".badge.badge-outline.badge-sm", vnode.state.keys.id),
        m("br"),
        `Do you want to use this SSB identity with Patchfox?`
      ]),
      makeToggle("Use identity", vnode.state.useIdentity, setUserIdentity),
      makeToggle("Start server when launching Patchfox", vnode.state.startServer, setServerStart),
      m("button.btn.btn-primary.mt-4", {
        onclick: nextStep
      }, "Next")
    ]
  }
}

const steps = {
  NewInstallation,
  ExistingInstallation,
  CustomKeys
}

const FirstTimeSetupView = {
  oninit: vnode => {
    vnode.state.preferencesFileExists = preferencesFileExists()

    currentStep = vnode.state.preferencesFileExists ? steps["ExistingInstallation"] : steps["NewInstallation"]
  },
  view: vnode => {
    return m(".w-auto.mx-auto.p-4", [
      m("h1.text-medium.uppercase.mb-2", "Patchfox Setup"),
      m(currentStep)
    ])
  }
}

module.exports = FirstTimeSetupView
