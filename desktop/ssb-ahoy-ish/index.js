const { app, ipcMain } = require('electron')
const secretStack = require('secret-stack')
const caps = require('ssb-caps')
const { promisify } = require('util')

const Menu = require('./electron/menu')
const UIWindow = require('./electron/window/ui-window')
const logger = require('./lib/log')
const log = logger.bind(null, 'main')

const Config = require('./lib/build-config')

module.exports = function ahoy (url, opts, cb) {
  if (cb === undefined) return promisify(ahoy)(url, opts)

  const {
    title = 'hello_world',
    plugins = [],
    config: _config
  } = opts

  const config = Config(title, plugins, _config)

  if (!Array.isArray(plugins)) throw Error('ssb-ahoy: plugins must be an array')
  if (!isValidUrl(url)) throw Error('ssb-ahoy: expects a ui URL which starts with http: | https: | file:')

  const state = {
    quitting: false
  }

  app.on('before-quit', () => {
    state.quitting = true
    log('quitting')
  })

  app.on('ready', () => {
    // reply to ui-window calls for ssb config
    ipcMain.handle('get-config', () => config)

    Menu()

    startSSB(plugins, config, (err, ssb) => {
      if (err) throw err // TODO launch error UI

      config.manifest = ssb.getManifest()
      // TODO write to path/manifest.json

      launchUI(url, title, state, (err) => {
        if (err) throw err // TODO launch error UI
        cb(null, ssb)
      })
    })
  })
}

function startSSB (plugins, config, cb) {
  log('starting Server')

  const stack = secretStack({ caps: config.caps || caps })
  plugins.forEach(plugin => stack.use(plugin))

  const ssb = stack(config)

  const isReady = ssb.whoami
  // TODO 2022-04-05 - replace with a fn which is a better test of "ready"
  isReady((err, data) => {
    if (err) throw new Error(err)
    cb(null, ssb)
  })
}

function launchUI (url, title, state, cb) {
  log('starting UI')

  const uiWindow = UIWindow(url, { title })
  uiWindow.setSheetOffset(40)

  /* handle OSX minimizing */
  uiWindow.on('close', ev => {
    if (process.platform === 'darwin') {
      if (!state.quitting) {
        ev.preventDefault()
        uiWindow.hide()
      }
    } else {
      app.quit()
    }
  })

  // OSX - reopen app when dock icon is clicked
  app.on('activate', ev => uiWindow.show())

  cb(null)
}

function isValidUrl (str) {
  if (typeof str !== 'string') return false

  const validStarts = [
    'file:',
    'http:',
    'https:'
  ]

  return validStarts.some(start => str.startsWith(start))
}
