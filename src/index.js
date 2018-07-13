import './main.css'
import { Main } from './Main.elm'
import client from 'ssb-client'
import config from 'ssb-config'
import ssbKeys from 'ssb-keys'
import avatar from 'ssb-avatar'
import manifest from './manifest'
import "highlight.js"
import webresolve from 'ssb-web-resolver'
import toPull from 'stream-to-pull-stream'
import pull from 'pull-stream'


let app
let userCache = new Map()
let errorCount = 0

const flog = (content, data) => {
  console.log(`[ELM - JS Part] ${content}`, "undefined" !== typeof data ? data : "")
}

const handleIPCResponse = (data) => {
  flog(`background script sent a response`, data)
  switch (data.type) {
    case "config":
      if (data.config.hasOwnProperty('secret')) {
        flog("Received new config", data.config)
        const keys = data.config.keys
        const remote = data.config.remote

        client(
          keys,
          {
            remote: remote,
            caps: config.caps,
            manifest: manifest
          },
          (err, sbot) => {
            window.sbot = sbot

            if (err) {
              handleIPCError(err)
              // flog("[FRONT-END] patchfox client trying to start scuttle-shell")
              // sendIPCCommand("start-native-app")
            } else {
              instantiateApp(null, sbot)
            }
          }
        )
      } else {
        flog("Error, we don't have a config yet, ask again...")
        setTimeout(getConfig, 1000)
        errorCount++
      }
      break
    case "native-app":
      flog("Native app started, ask configuration again")
      getConfig()
      break
  }
}

const handleIPCError = (error) => {
  errorCount++
  flog(`Error: ${error}`)
}

const instantiateApp = (err, sbot) => {
  if (err) {

    sendIPCCommand("problem-no-sbot")

  } else {
    errorCount = 0
    flog("Checking if sbot works...")
    avatar(sbot, sbot.id, sbot.id, (err, data) => {
      let obj = null
      if (data) {
        flog("Sbot works", data)
        obj = {
          id: data.id,
          name: data.name,
          image: "http://localhost:8989/blobs/get/" + data.image
        }
        userCache.set(data.id, obj)
      } else {
        flog("ERROR on avatar", err)
        errorCount++
      }

      app = Main.embed(document.getElementById('root'), {
        error: err ? err : null,
        user: data ? obj : null,
      })

      app.ports.infoForOutside.subscribe(msg => {
        flog("infoForOutside", msg)
        switch (msg.tag) {
          case "CheckTypeAndRedirect":
            let id = encodeURIComponent(msg.data)
            sbot.get(msg.data,
              (err, data) => {
                if (data) {
                  flog("msg", data)
                  switch (data.content.type) {
                    case "post":
                      location.hash = `#/thread/${id}`
                      break
                    case "web-init":
                      location.hash = `#/thread/${id}`
                      break
                    case "web-root":
                      location.hash = `#/thread/${id}`
                      break
                  }
                } else {
                  flog("err", err)
                }
              }
            )
            break
          case "RelatedMessages":
            sbot.relatedMessages(
              { id: msg.data },
              (err, msgs) => {
                if (msgs) {
                  // let arr = []
                  // arr.push(msgs.value)
                  // arr[0].key = msgs.key
                  // arr = arr.concat(msgs.related)
                  flog("ThreadReceived", msgs)
                  app.ports.infoForElm.send({ tag: "ThreadReceived", data: msgs })
                } else {
                  flog("ERROR on related messages", err)
                }
              }
            )
            break
          case "Avatar":
            flog("received avatar request", msg)
            if (userCache.has(msg.data)) {
              flog("Avatar cached for " + msg.data)
              app.ports.infoForElm.send({ tag: "AvatarReceived", data: userCache.get(msg.data) })
            } else {
              avatar(sbot, sbot.id, msg.data, (err, data) => {
                if (data) {
                  let obj = {
                    id: data.id,
                    name: data.name,
                    image: "http://localhost:8989/blobs/get/" + data.image
                  }

                  userCache.set(data.id, obj)

                  app.ports.infoForElm.send({ tag: "AvatarReceived", data: obj })
                } else {
                  flog("ERROR on avatar", err)
                }
              })
            }
            break
          case "WebResolve":
            let components = [
              msg.data,
              "index.html"
            ]
            webresolve(sbot, components, function (err, data) {
              if (err) {
                flog('ERROR: ' + err)
              } else {
                flog('web', data)
              }
              // return pull(
              //   pull.once(data),
              //   toPull(res, function (err) {
              //     if (err) console.error('[viewer]', err)
              //   })
              // )
            })
            break
          case "OpenOptionsPage":
            browser.runtime.openOptionsPage()
            break
        }
      })
    })
  }
}

const sendIPCCommand = (cmd, data) => {
  let sending = browser.runtime.sendMessage({ cmd, data })
  sending.then(handleIPCResponse, handleIPCError)
}

const getConfig = () => {
  if (errorCount < 8) {
    flog("[FRONT-END] patchfox client trying to acquire configuration")
    sendIPCCommand("get-config")
  } else {
    flog(`[FRONT-END] too many errors trying to acquire config: ${errorCount}`)
    sendIPCCommand("problem-no-config")
  }
}


// The code below is to handle custom protocol (ssb:)
if (location.hash.indexOf("#/view/") !== -1) {
  // fix problem with IDs containing slashes
  let id = location.hash
  if (id.indexOf("ssb%3A") !== -1) {
    id = id.replace("ssb%3A", "")
  }
  id = encodeURIComponent(decodeURIComponent(id.slice(7)))

  location.hash = `#/view/${id}`
}

flog("[FRONT-END] calling getConfig.")
getConfig()


