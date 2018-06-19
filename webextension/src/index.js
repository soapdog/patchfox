import './main.css'
import { Main } from './Main.elm'
import client from 'ssb-client'
import config from 'ssb-config'
import ssbKeys from 'ssb-keys'
import avatar from 'ssb-avatar'
import manifest from './manifest'
import "highlight.js"


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
              instantiateApp(err, null)
            } else {
              instantiateApp(null, sbot)
            }
          }
        )
      } else {
        flog("Error, we don't have a config yet, ask again...")
        setTimeout(getConfig, 3500)
        errorCount++
      }
      break
    case "native-app":
      flog("Native app starting, ask configuration in 3.5 seconds")
      setTimeout(getConfig, 3500)
      break
  }
}

const handleIPCError = (error) => {
  errorCount++
  flog(`Error: ${error}`)
}

const instantiateApp = (err, sbot) => {
  if (err) {
    console.error("error", err)
    errorCount++
    if (errorCount < 15) {
      flog("Can't start SBOT from saved configuration, trying to start native app.")
      sendIPCCommand("start-native-app")
    } else {
      sendIPCCommand("problem-no-sbot")
    }
  } else {
    avatar(sbot, sbot.id, sbot.id, (err, data) => {
      let obj = null
      if (data) {
        flog("avatar for current user", data)
        obj = {
          id: data.id,
          name: data.name,
          image: "http://localhost:8989/blobs/get/" + data.image
        }
        userCache.set(data.id, obj)
      } else {
        flog("ERROR on avatar", err)
      }

      app = Main.embed(document.getElementById('root'), {
        error: err ? err : null,
        user: data ? obj : null,
      })

      app.ports.infoForOutside.subscribe(msg => {
        flog("infoForOutside", msg)
        switch (msg.tag) {
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
                  // flog("avatar from js", data)
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
  if (errorCount < 15) {
    flog("[FRONT-END] patchfox client trying to acquire configuration")
    sendIPCCommand("get-config")
  } else {
    flog(`[FRONT-END] too many errors trying to acquire config: ${errorCount}`)
    sendIPCCommand("problem-no-config")
  }
}


// The code below is to handle custom protocol (ssb:)
if (location.hash.indexOf("#/thread/") !== -1) {
  // fix problem with IDs containing slashes
  let id = location.hash
  if (id.indexOf("ssb%3A") !== -1) {
    id = id.replace("ssb%3A", "")
  }
  id = encodeURIComponent(decodeURIComponent(id.slice(9)))

  location.hash = `#/thread/${id}`
}

flog("[FRONT-END] calling getConfig.")
getConfig()


