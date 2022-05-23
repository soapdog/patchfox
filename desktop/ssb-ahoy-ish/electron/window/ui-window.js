const { BrowserWindow, shell } = require('electron')
const WindowState = require('electron-window-state')
const path = require('path')

const preloadPath = path.join(__dirname, '../preload.js')

module.exports = function uiWindow (url, opts = {}) {
  const windowState = WindowState({
    defaultWidth: 1024,
    defaultHeight: 768
  })

  const win = new BrowserWindow({
    title: 'ui',
    show: true,

    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
    minWidth: 800,

    autoHideMenuBar: true,
    frame: process.env.ELECTRON_FRAME !== 'false',
    // titleBarStyle: 'hidden',
    backgroundColor: '#fff',
    // icon: '../assets/icon.png', // may not be needed

    ...opts,

    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath
    }
  })

  windowState.manage(win)

  win.webContents.on('will-navigate', (ev, url) => {
    ev.preventDefault()
    shell.openExternal(url)
  })

  win.webContents.on('new-window', (ev, url) => {
    ev.preventDefault()
    shell.openExternal(url)
  })

  win.loadURL(url)

  return win
}
