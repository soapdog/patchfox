const { 
  Menu, 
  app, 
  dialog, 
  shell, 
  protocol, 
  BrowserWindow,
  Tray,
  ipcMain } = require("electron")
const path = require("path")
const arg = require("arg")
const defaultMenu = require("electron-default-menu")
const windowStateKeeper = require("electron-window-state")
const queryString = require("query-string")
const { startDefaultPatchfoxServer } = require("./server/server.js")
const {
  preferencesFileExists,
  getDefaultIdentity,
  getPref
} = require("./ui/core/kernel/prefs.js")

let windows = new Set()
let sbot = null
let tray = null

// register app defaults
app.setName("patchfox")
app.setAsDefaultProtocolClient("ssb")
app.setPath("userData", path.join(app.getPath("appData"), "Patchfox"))
process.env = process.env ?? {}
process.env.APP_DIR = app.getPath("userData")
process.env.SSB_DIR = process.env.SSB_DIR ?? path.resolve(app.getPath("userData"), "ssb")

// Command-line args
const args = arg({
  // Types
  "--help": Boolean,
  "--version": Boolean,
  "--rebuild-indexes": Boolean,
  "--package": String,
  "--view": String,
})


const createApplicationWindow = (patchfoxEvent = {}, windowState = false) => {
  let win
  let event = patchfoxEvent?.event || false
  let data = patchfoxEvent?.data || false

  if (!windowState) {
    // Create the browser window.
    win = new BrowserWindow({
      width: 800,
      height: 800,
      show: false,
      skipTaskbar: getPref("skipTaskbar", false),
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    })
  } else {
    win = new BrowserWindow({
      x: windowState.x,
      y: windowState.y,
      show: false,
      skipTaskbar: getPref("skipTaskbar", false),
      width: windowState.width,
      height: windowState.height,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    })

    windowState.manage(win)
  }

  windows.add(win)

  win.on("closed", () => {
    windows.delete(win)
    win = null
  })

  win.on("focus", () => {
    win.webContents.send("window:focus")
  })

  win.once("ready-to-show", () => {
    win.show()
  })

  win.webContents.on("will-navigate", (event, url) => {
    console.log("event", event)
    console.log("url", url)
  })

  // and load the index.html of the app.
  // console.log("data", data)

  if (data?.url) {
    win.loadURL(data.url)
  } else if (data?.pkg) {
    let state = { pkg: data.pkg, view: data.view, ...data }
    let qs = queryString.stringify(state)
    let url = `file://${__dirname}/ui/index.html?${qs}`
    console.log(url)
    win.loadURL(url)
  } else if (event === "documentation:open") {
    let url = `file://${__dirname}/docs/index.html#${data}`
    console.log(url)
    win.loadURL(url)
  } else {
    let url = `file://${__dirname}/ui/index.html`
    console.log(url)
    win.loadURL(url)
  }

  // Open the DevTools.
  // win.webContents.openDevTools()

  win.webContents.setWindowOpenHandler(details => {
    if (details.url.startsWith("file:")) {
      createApplicationWindow({event: "url:open", data: { url: details.url }})
      return { action: "deny" }
    } else {
      shell.openExternal(details.url)
      return { action: "deny" }
    }
  })
}


const firstTimeSetup = () => {
  let win
  win = new BrowserWindow({
    width: 600,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  windows.add(win)

  win.on("closed", () => {
    windows.delete(win)
    win = null
  })

  win.loadURL(`file://${__dirname}/ui/dialog.html?pkg=firstTimeSetup`)

  // This event handler is here to benefit from the closure of `win`
  ipcMain.on("setup:done", (event, data) => {
    win.close()
    try {
      let defaultIdentity = getDefaultIdentity()
      if (defaultIdentity.startServer) {
        startServer(defaultIdentity)
      } else {
        createApplicationWindow({event, data})
      }
    }catch (e) {
      console.log(e)
    }
  })
}

function startServer(identity) {
  startDefaultPatchfoxServer(identity, (err, ssb) => {
    console.log("Server started!", ssb.id)
    sbot = ssb

    // progress checker
    let progress = ssb.progress()
    let win

    if (progress.indexes.current < progress.indexes.target) {
      win = new BrowserWindow({
        width: 400,
        height: 400,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        }
      })

      windows.add(win)

      win.on("closed", () => {
        windows.delete(win)
        win = null
      })

      win.loadURL(`file://${__dirname}/ui/dialog.html?pkg=reindexingDialog`)
      // win.webContents.openDevTools()


      const checkProgress = () => {
        let progress = ssb.progress()

        if (progress.indexes.current < progress.indexes.target) {
          console.log("sending progress", progress)
          win.webContents.send("progress", progress)
          setTimeout(checkProgress, 1000)
        } else {
          let mainWindowState = windowStateKeeper({
            defaultWidth: 800,
            defaultHeight: 600
          })

          win.close()

          if (args["--package"]) {
            let pkg = args["--package"]
            let view = args["--view"] ??  "view"
            createApplicationWindow({event: "package:go", data: {pkg, view}}, mainWindowState)
          } else {
            createApplicationWindow(null, mainWindowState)
          }
        }
      }

      setTimeout(checkProgress, 1000)

      return
    }

    // main window
    let mainWindowState = windowStateKeeper({
      defaultWidth: 800,
      defaultHeight: 600
    })

    console.log(process.argv)
    if (args["--package"]) {
      let pkg = args["--package"]
      let view = args["--view"] ??  "view"
      createApplicationWindow({event: "package:go", data: {pkg, view}}, mainWindowState)
    } else {
      createApplicationWindow(null, mainWindowState)
    }

  })
}

// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  tray = new Tray(`${__dirname}/ui/assets/images/patchfox_pixel_16.png`)
  tray.setToolTip("Patchfox")

  const initialMenu = Menu.buildFromTemplate([
    {
      label: "Quit",
      click() { app.quit() }
    }
  ])
  tray.setContextMenu(initialMenu)

  // first-time user experience
  if (!preferencesFileExists()) {
    console.log("Launching first time setup...")
    firstTimeSetup()
    return
  } else {
    console.log("preferences exist")
  }

  // load default identity and start
  try {
    let defaultIdentity = getDefaultIdentity()
    if (defaultIdentity.startServer) {
      startServer(defaultIdentity)
    } else if (defaultIdentity) {
      if (args["--package"]) {
        let pkg = args["--package"]
        let view = args["--view"] ??  "view"
        createApplicationWindow({event: "package:go", data: {pkg, view}})
      } else {
        createApplicationWindow()
      }
    } else {
      firstTimeSetup()
    }
  }catch (e) {
    console.log("error, probably no default identity", e)
    firstTimeSetup()
  }
})

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("will-quit", () => {
  if (sbot) {
    console.log("Quitting SSB server.")
    sbot.close()
  }
})

app.on("activate", () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (sbot && BrowserWindow.getAllWindows().length === 0) {
    let mainWindowState = windowStateKeeper({
      defaultWidth: 800,
      defaultHeight: 600,
    })

    createApplicationWindow(null, mainWindowState)
  }
})

app.on("open-url", (event, url) => {
  event.preventDefault()
  console.log("url", url)
  if (sbot) {
    createApplicationWindow({event: "package:open", data: { pkg: "intercept", view: "view", query: url }})
  } else {
    setTimeout(() => {
      createApplicationWindow({event: "package:open", data: { pkg: "intercept", view: "view", query: url }})
    },2000)
  }
})


ipcMain.on("new-patchfox-window", (event, data) => {
  createApplicationWindow({event, data})
})

ipcMain.on("preferences:reload", (event, data) => {
  windows.forEach(w => {
    w.webContents.send("preferences:reload")
  })
})

ipcMain.on("preferences:path", (event, data) => {
  event.returnValue = path.resolve(app.getPath("userData"), "patchfox.toml")
})

ipcMain.on("preferences:env", (event, data) => {
  event.returnValue = Object.assign({}, process.env)
})

ipcMain.on("window:set-title", (event, data) => {
  let win = BrowserWindow.fromWebContents(event.sender)
  data = data.replace(/\w\S*/g, w => w.replace(/^\w/, c => c.toUpperCase()))
  win.setTitle(data)
})

ipcMain.on("menu:set", (event, group) => {
  // console.log("received menu", JSON.stringify(group, null, 2))
  const menu = defaultMenu(app, shell)
  let newMenus = []
  let keys = Object.keys(group)

  // console.log(JSON.stringify(menu,null,2))

  const makeSubmenu = subgroup => {
    let toPush = []
    subgroup.forEach(m => {
      m.items.forEach(i => {
        let m = {
          label: i.label,
          click: (item, win) => {
            win.webContents.send("menu:trigger", {
              event: i.event,
              data: i.data,
            })
          },
        }

        if (i?.shortcut) {
          m.accelerator = i.shortcut
        }

        toPush.push(m)
      })
      toPush.push({ type: "separator" })
    })
    toPush.pop()
    return toPush
  }

  keys.forEach(k => {
    let m = {
      label: k,
      submenu: makeSubmenu(group[k]),
    }

    if (k.toLowerCase() == "help") {
      m.role = "help"
    }

    newMenus.push(m)
  })

  // FIXME: menu has wrong order for toplevel items.
  let fileMenu = {
    label: "File",
    role: "file",
    submenu: [
      {
        label: "New Window",
        accelerator: "CmdOrCtrl+Shift+N",
        click: () => {
          createApplicationWindow()
        },
      },
      {
        role: "shareMenu"
      }
    ],
  }

  let helpMenu = newMenus.pop()

  menu.splice(1, 0, fileMenu)
  menu.splice(3, 0, ...newMenus)

  menu.pop() // get rid of original help menu.

  menu.push(helpMenu) // insert our own help menu.

  let patchfoxMenuIndex = menu.findIndex(e => e.label == "Application")

  let patchfoxMenu = menu[patchfoxMenuIndex].submenu
  let appMenu = menu[0].submenu

  appMenu.splice(1, 0, { type: "separator" }, ...patchfoxMenu)

  menu[0].submenu = appMenu
  menu.splice(patchfoxMenuIndex, 1)

  // console.log(JSON.stringify(menu, null, 2))
  let finalMenu = Menu.buildFromTemplate(menu)

  Menu.setApplicationMenu(finalMenu)
})

ipcMain.on("tray:set", (event, items) => {
  // console.log("received menu", JSON.stringify(group, null, 2))
  let menu = []

  // console.log(JSON.stringify(menu,null,2))

  const makeMenu = i => {
    if (i?.type) {
      return i
    }

    let m = {
      label: i.label,
      click: (item, win) => {
        createApplicationWindow({event: i.event, data: i.data})
      },
    }

    if (i?.shortcut) {
      m.accelerator = i.shortcut
    }

    return m
  }

  menu = items.map(i => makeMenu(i))

  // FIXME: menu has wrong order for toplevel items.
  let topItems = [
    {
      label: "New Window",
      accelerator: "CmdOrCtrl+Shift+N",
      click: () => {
        createApplicationWindow()
      }
    },
    {
      type: "separator"
    },
  ]

  let bottomItems = [
    {
      type: "separator"
    },
    {
      label: "Quit",
      click() { app.quit() }
    }
  ]

  let finalMenu = Menu.buildFromTemplate([...topItems, ...menu, ...bottomItems])

  tray.setContextMenu(finalMenu)
})

