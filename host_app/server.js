#! /usr/bin/env node

var http = require('http')
var serve = require('ecstatic')
var fs = require('fs')
var path = require('path')
var ssbKeys = require('ssb-keys')
var minimist = require('minimist')

var argv = process.argv.slice(2)
var i = argv.indexOf('--')
var conf = argv.slice(i + 1)
argv = ~i ? argv.slice(0, i) : argv

var config = require('ssb-config/inject')(process.env.ssb_appname, minimist(conf))

var keys = ssbKeys.loadOrCreateSync(path.join(config.path, 'secret'))
if (keys.curve === 'k256') {
  throw new Error('k256 curves are no longer supported,' +
    'please delete' + path.join(config.path, 'secret'))
}

var manifestFile = path.join(config.path, 'manifest.json')

// special server command:
// import sbot and start the server

var createSbot = require('scuttlebot')
  // .use(require('scuttlebot/plugins/plugins'))
  .use(require('scuttlebot/plugins/master'))
  .use(require('scuttlebot/plugins/gossip'))
  .use(require('scuttlebot/plugins/replicate'))
  .use(require('ssb-friends'))
  .use(require('ssb-blobs'))
  .use(require('scuttlebot/plugins/invite'))
  .use(require('scuttlebot/plugins/local'))
  // .use(require('scuttlebot/plugins/logging'))
  // .use(require('scuttlebot/plugins/private'))
  // .use(require('ssb-query'))
  // .use(require('ssb-links'))
  .use(require('ssb-ooo'))
  .use(require('ssb-ebt'))
  .use(require('ssb-ws'))
  .use({
    name: 'share-ws',
    version: '1.0.0',
    init: function (sbot) {
      sbot.ws.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*')
        if (req.url === '/get-address') {
          res.end(sbot.ws.getAddress())
        } else {
          next()
        }
      })
    }
  })
  .use(require('ssb-names'))

http.createServer(
  serve({ root: path.resolve('../extension/build/') })
).listen(3013)

// add third-party plugins
// require('./plugins/plugins').loadUserPlugins(createSbot, config)

// start server

config.keys = keys
var server = createSbot(config)

// write RPC manifest to ~/.ssb/manifest.json
fs.writeFileSync(manifestFile, JSON.stringify(server.getManifest(), null, 2))
