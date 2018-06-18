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

const flog = (content, data) => {
  console.log(`[ELM - JS Part] ${content}`, "undefined" !== typeof data ? data : "")
}

const handleResponse = (data) => {
  flog(`background script sent a response`, data)
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
          handleError(err)
        } else {
          boot(null, sbot)
        }
      }
    )
  } else {
    flog("Error, we don't have a config yet, ask again...")
    setTimeout(getConfig, 3500)
    // todo: need an exit condition...
  }
}

const handleError = (error) => {
  flog(`Error: ${error}`)
  boot(error, null)
}

const instantiateApp = () => {

}

const boot = (err, sbot) => {
  if (err) {
    console.error("error", err)
    flog("Can't start SBOT from saved configuration, trying to start native app.")
    startNativeApp()
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
        flog("ERROR", err)

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
                  flog("ERROR", err)
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
                  flog("ERROR", err)
                }
              })
            }
            break
        }
      })
    })
  }
}

const getConfig = () => {
  flog("[FRONT-END] patchfox client trying to acquire configuration")
  let sending = browser.runtime.sendMessage({ cmd: "get-config" })
  sending.then(handleResponse, handleError)
}


const startNativeApp = () => {
  flog("[FRONT-END] patchfox client trying to start the native app")
  let sending = browser.runtime.sendMessage({ cmd: "start-native-app" })
  sending.then(handleResponse, handleError)
}


if (location.hash.indexOf("#/thread/") !== -1) {
  // fix problem with IDs containing slashes
  flog("fixing thread id")
  let id = location.hash
  if (id.indexOf("ssb%3A") !== -1) {
    id = id.replace("ssb%3A", "")
  }
  id = encodeURIComponent(decodeURIComponent(id.slice(9)))


  location.hash = `#/thread/${id}`
  console.log("making hash", location.hash)

}

flog("[FRONT-END] calling boot.")
getConfig()


