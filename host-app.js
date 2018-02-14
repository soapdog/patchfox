const http = require('http')
const serve = require('ecstatic')
const nativeMessage = require('chrome-native-messaging')
const party = require('ssb-meta-party')
const path = require('path')

// todo: switch this to use childprocess and serve.js, somehow ssb-party is quiting the process.

const input = new nativeMessage.Input()
const transform = new nativeMessage.Transform((msg, push, done) => {
  getReplyFor(msg, data => {
    push(data)
    done()
  })
})
const output = new nativeMessage.Output()

const startServer = (cb) => {
  output.write({ type: "debug", msg: `starting scuttlebutt` })
  party((err, sbot) => {
    if (err) {
      output.write({ type: "error", err })
      return
    }

    // http.createServer(
    //   serve({ root: path.join(__dirname, '/build/') })
    // ).listen(3013)
    output.write({ type: "debug", msg: `no errors starting scuttlebutt` })

    cb({ type: 'server', server: 'http://localhost:3013' })
  })
}

const getReplyFor = (msg, cb) => {
  output.write({ type: "debug", msg: `trying to get reply for ${msg.cmd}` })
  switch (msg.cmd) {
    case 'start-server':
      startServer(cb)
      break
    case 'meleca':
      cb('bah!' + new Date())
      break
    case 'stop-server': {
      clearInterval(timer)
      cb({ type: 'msg', msg: 'stopping server' })
      process.exit(1)
    }
  }
}

var timer = setInterval(function () {
  output.write({ type: "ping", time: new Date().toISOString() })
}, 1000)

input.on('end', function () {
  clearInterval(timer)
})

process.stdin
  .pipe(input)
  .pipe(transform)
  .pipe(output)
  .pipe(process.stdout)
