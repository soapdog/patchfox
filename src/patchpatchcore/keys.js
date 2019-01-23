const Path = require('path')
const Keys = require('ssb-keys')
const nest = require('depnest')

exports.patched = true

exports.gives = nest({
  'keys.sync': [ 'load', 'id' ]
})

exports.create = (api) => {
  var keys

  return nest({
    'keys.sync': { load, id }
  })

  function id () {
    return load().id
  }

  function load () {
    if (!keys) {
      keys = ssb.keys
    }
    return keys
  }
}
