const { Menu, app, dialog, shell, BrowserWindow, ipcMain } = require("electron")
const path = require("path")
const defaultMenu = require("electron-default-menu")
const windowStateKeeper = require("electron-window-state")

let windows = new Set()

const createWindow = (data = false, windowState = false) => {
  let win

  if (!windowState) {
    // Create the browser window.
    win = new BrowserWindow({
      width: 800,
      height: 800,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    })
  } else {
    win = new BrowserWindow({
      x: windowState.x,
      y: windowState.y,
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
  
  win.webContents.on("will-navigate", (event, url) => {
    console.log("event", event)
    console.log("url", url)
  })

  // and load the index.html of the app.
  if (data?.url) {
    win.loadURL(data.url)
  } else {
    win.loadURL(`file://${__dirname}/ui/index.html`)
  }

  // Open the DevTools.
  // win.webContents.openDevTools()

  win.webContents.setWindowOpenHandler((details) => {
    if (details.url.startsWith("file:")) {
      createWindow({ url: details.url })
      return { action: "deny" }
    } else {
      shell.openExternal(details.url)
      return { action: "deny" }
    }
  })

  //   const menu = defaultMenu(app, shell)
  // 
  //   Menu.setApplicationMenu(Menu.buildFromTemplate(menu))

  if (data?.pkg) {
    win.webContents.send("patchfox:event", { event: "package:go", data })
  }
}

ipcMain.on("new-patchfox-window", (event, data) => {
  createWindow(data)
})

ipcMain.on("window:set-title", (event, data) => {
  let win = BrowserWindow.fromWebContents(event.sender)
  data = data.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))
  win.setTitle(data)
})

ipcMain.on("menu:set", (event, group) => {
  // console.log("received menu", JSON.stringify(group, null, 2))
  const menu = defaultMenu(app, shell)
  let newMenus = []
  let keys = Object.keys(group)

    console.log(JSON.stringify(menu,null,2))

  const makeSubmenu = (subgroup) => {
    let toPush = []
    subgroup.forEach((m) => {
      m.items.forEach((i) => {
        toPush.push({
          label: i.label,
          click: (item, win) => {
            win.webContents.send("menu:trigger", {
              event: i.event,
              data: i.data,
            })
          },
        })
      })
      toPush.push({ type: "separator" })
    })
    toPush.pop()
    return toPush
  }

  keys.forEach((k) => {
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
        click: () => {
          createWindow()
        },
      },
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

  appMenu.splice(1,0,{type: "separator"}, ...patchfoxMenu)

  menu[0].submenu = appMenu
  menu.splice(patchfoxMenuIndex, 1)

  console.log(JSON.stringify(menu,null,2))
  let finalMenu = Menu.buildFromTemplate(menu)

  Menu.setApplicationMenu(finalMenu)

})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600,
  })

  createWindow(null, mainWindowState)
})

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and import them here.
