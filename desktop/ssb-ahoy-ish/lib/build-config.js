const defaultConfig = require('ssb-config/defaults.js')
const envPaths = require('env-paths')
const merge = require('deep-extend')
const { join } = require('path')

module.exports = function buildConfig (title, plugins, userConfig = {}) {
  const path = userConfig.path || join(
    envPaths('ssb-ahoy', { suffix: '' }).data,
    'dev',
    title.replace(/[^\w]+/g, '-')
  )

  let config = defaultConfig(null, { path, ...userConfig })

  config = addSockets(config, plugins)
  config = fixLocalhost(config)

  return config
}

// TODO - move these two up into ssb-config
function addSockets (config, plugins) {
  if (process.platform === 'win32') return config

  const hasSocketPlugins = (
    plugins.find(plugin => plugin.name === 'unix-socket') &&
    plugins.find(plugin => plugin.name === 'no-auth')
  )
  if (!hasSocketPlugins) return config

  const pubkey = config.keys.id.slice(1).replace(`.${config.keys.curve}`, '')
  return merge(
    config,
    {
      connections: {
        incoming: { unix: [{ scope: 'device', transform: 'noauth', server: true }] }
      },
      remote: `unix:${join(config.path, 'socket')}:~noauth:${pubkey}` // overwrites
    }
  )
}

function fixLocalhost (config) {
  if (process.platform !== 'win32') return config

  //  host values default to :: which seems to break Windows 10

  const unsafe = '::'
  const safe = '127.0.0.1'
  if (config.connections.incoming.net[0].host === unsafe) {
    config.connections.incoming.net[0].host = safe
  }

  if (config.connections.incoming.ws[0].host === unsafe) {
    config.connections.incoming.ws[0].host = safe
  }

  if (config.host === unsafe) {
    config.host = safe
  }

  return config
}
