import './main.css'
import { Main } from './Main.elm'
import client from 'ssb-client'
import config from 'ssb-config'
import ssbKeys from 'ssb-keys'
import avatar from 'ssb-avatar'
import manifest from './manifest'
import "highlight.js"


let app

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

const boot = (err, sbot) => {
  app = Main.embed(document.getElementById('root'), {
    error: err
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
        avatar(sbot, sbot.id, msg.data, (err, data) => {
          if (data) {
            flog("avatar from js", data)
          } else {
            flog("ERROR", err)
          }
        })
        break
    }
  })



}

const getConfig = () => {
  flog("[FRONT-END] patchfox client trying to acquire configuration")
  let sending = browser.runtime.sendMessage({ cmd: "get-config" })
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


