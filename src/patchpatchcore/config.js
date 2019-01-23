const Config = require('ssb-config/inject')
const nest = require('depnest')

exports.patched = true

exports.gives = nest('config.sync.load')
exports.create = (api) => {
  var config
  return nest('config.sync.load', () => {
    if (!config) {
      config = Config("ssb", {
          remote: window.ssb.remote
      })
    }
    return config
  })
}
