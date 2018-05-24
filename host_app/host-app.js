
const nativeMessage = require('chrome-native-messaging')
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')
const home = require('os').homedir()

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

const getConfig = () => {
  try {
    let secret = fs.readFileSync(`${home}/.ssb/secret`, "utf8")
    let keys = JSON.parse(secret.replace(/#[^\n]*/g, ''))
    let manifest = JSON.parse(fs.readFileSync(`${home}/.ssb/manifest.json`))
    let remote = "ws://localhost:8989~shs:" + keys.id.substring(1, keys.id.indexOf('.'))
    return { type: 'config', keys: keys, manifest: manifest, remote: remote, secret: secret }
  } catch (n) {
    return { type: 'exception', msg: n.message }
  }
}

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

  output.write(getConfig())
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
    case 'get-config': {
      let secretRaw = fs.readFileSync(`${home}/.ssb/secret`)
      let keys = JSON.parse(secret.replace(/#[^\n]*/g, ''))
      let manifest = JSON.parse(fs.readFileSync(`${home}/.ssb/manifest.json`))
      let remote = "ws://localhost:8989~shs:" + keys.id.substring(1, keys.id.indexOf('.'))

      cb({ type: 'config', keys, manifest, remote })
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
