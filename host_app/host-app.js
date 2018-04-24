
const nativeMessage = require('chrome-native-messaging')
const { spawn } = require('child_process')
const path = require('path')

// todo: switch this to use childprocess and serve.js, somehow ssb-party is quiting the process.
// todo: implemented childprocess, but it is strange...

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

  var scriptPath = path.join(__dirname, 'server.js')
  var child = spawn(process.execPath, [scriptPath])

  child.stdout.on('data', (data) => {
    output.write({ type: 'debug', msg: `stdout: ${data}` })
  })

  child.stderr.on('data', (data) => {
    output.write({ type: 'error', msg: `stderr: ${data}` })
  })

  child.on('close', (code) => {
    output.write({ type: 'debug', msg: `child process exited with code ${code}` })
  })

  output.write({ type: 'up', msg: 'server up, try again', retry: 3500 })
}

const getReplyFor = (msg, cb) => {
  output.write({ type: "debug", msg: `trying to get reply for ${msg.cmd}` })
  switch (msg.cmd) {
    case 'start-server':
      startServer(cb)
      break
    case 'stop-server': {
      clearInterval(timer)
      cb({ type: 'shutdown', msg: 'stopping server' })
      process.exit(1)
    }
  }
}

var timer = setInterval(function () {
  output.write({ type: "ping", time: new Date().toISOString() })
}, 120000)

input.on('end', function () {
  clearInterval(timer)
})

process.stdin
  .pipe(input)
  .pipe(transform)
  .pipe(output)
  .pipe(process.stdout)
