import client from 'ssb-client'
import config from 'ssb-config'
import ssbKeys from 'ssb-keys'
import avatar from 'ssb-avatar'
import "highlight.js"
import webresolve from 'ssb-web-resolver'
import toPull from 'stream-to-pull-stream'
import pull from 'pull-stream'
import './sass/main.scss'

const main = async () => {
  let app, sbot
  let userCache = new Map()

  function outputMessage(msg) {
    let chunk = ` <div id="root">
    <img src="images/icon.png" alt="hermie" style="width: 42px">
    <h4 id="message">
        ${msg}
    </h4>
</div>`
    document.body.innerHTML = chunk
  }

  async function handleBackgroundResponse(data) {
    console.log("handleBackgroundResponse", data)
    switch (data.type) {
      case "config":
        if (data.config.hasOwnProperty('secret')) {
          const keys = data.config.keys
          const remote = data.config.remote
          const manifest = data.config.manifest
          localStorage.setItem("config", JSON.stringify(data.config))

          outputMessage("Launching Scuttle-Shell, waiting 5 seconds for it to launch...")
          setTimeout(async () => {
            try {
              sbot = await startSSBClient(remote, keys, manifest)
              await launchApp()
            } catch (e) {
              console.error("problem launching app from background response", e)
            }
          }, 5000)

        }
        break
    }
  }

  async function sendBackgroundCommand(cmd, data) {
    console.log("sendBackgroundCommand", cmd, data)
    if (typeof browser !== "undefined") {
      try {
        let sending = await browser.runtime.sendMessage({ cmd, data })
        await handleBackgroundResponse(sending)
      } catch (e) {
        console.error("cant send background command", e)
      }
    } else {
      console.log("not an add-on, can't do background stuff")
      // need to launch patchfox with settings page.
    }
  }

  async function launchApp() {
    let el = document.body
    let config = JSON.parse(localStorage.getItem("config")) || {
      remote: "",
      keys: "",
      manifest: ""
    }
    el.innerHTML = ""

    if (config.remote !== "") {
      const remote = config.remote
      const keys = config.keys
      const manifest = config.manifest
      try {
        console.log("config is present, starting app.", config)
        sbot = await startSSBClient(remote, keys, manifest)
        console.log("passing through...", sbot)
        config.keys = JSON.stringify(config.keys)
        config.manifest = JSON.stringify(config.manifest)
        app = Main.embed(el, config)
        await initializePortSubscriptions()
        await getCurrentUserAvatar()
      } catch (e) {
        console.error("can't connect to sbot", e)
        await openScuttleShellOrSettings()
      }
    } else {
      console.log("no config")
      await openScuttleShellOrSettings()
    }
  }

  async function initializePortSubscriptions() {
    app.ports.infoForOutside.subscribe(async (msg) => {
      switch (msg.tag) {
        case "SaveConfiguration":
          console.log("trying to save configuration", msg.data)
          const remote = msg.data.remote
          const keys = JSON.parse(msg.data.keys)
          const manifest = JSON.parse(msg.data.manifest)
          localStorage.setItem("config", JSON.stringify({
            remote,
            keys,
            manifest
          }))
          await getCurrentUserAvatar()
          break
        case "CheckTypeAndRedirect":
          let id = encodeURIComponent(msg.data)
          sbot.get(msg.data, (err, data) => {
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
            }
            else {
              console.error("err", err)
            }
          })
          break
        case "PublicFeed":
          pull(
            sbot.createFeedStream({ reverse: true, limit: 200 }),
            pull.collect(function (err, msgs) {
              console.log("err", err)
              console.log("msgs", msgs)
              app.ports.infoForElm.send({ tag: "FeedReceived", data: msgs })
            })
          )
          break
        case "RelatedMessages":
          //fucking hack
          console.log("Calling related messages", msg)
          let msgid = decodeURIComponent(msg.data)
          console.log("trying to get", msgid)

          let addMsg = (msg, msgs) => {
            msg.forEach(m => {
              msgs.unshift({ key: m.key, value: m })
            })
            if (msgs) {
              let ms = msgs.sort((a, b) => a.value.timestamp > b.value.timestamp)
              console.log(ms)
              app.ports.infoForElm.send({ tag: "ThreadReceived", data: ms })
            }
            else {
              console.error("ERROR on related messages", err)
            }
          }
          pull(
            sbot.links({ dest: msgid, values: true, rel: 'root' }),
            pull.unique('key'),
            pull.collect(function (err, msgs) {
              sbot.get(msgid, (err, msg) => {
                if (msg.content.hasOwnProperty("root")) {
                  sbot.get(msg.content.root, (err, rootMsg) => {
                    rootMsg.key = msg.content.root
                    msg.key = msgid
                    addMsg([rootMsg, msg], msgs)
                  })
                } else {
                  msg.key = msgid
                  addMsg([msg], msgs)
                }
              })
            })
          )
          break
        case "Avatar":
          if (userCache.has(msg.data)) {
            app.ports.infoForElm.send({ tag: "AvatarReceived", data: userCache.get(msg.data) })
          }
          else {
            avatar(sbot, sbot.id, msg.data, (err, data) => {
              if (data) {
                let obj = {
                  id: data.id,
                  name: data.name,
                  image: "http://localhost:8989/blobs/get/" + data.image
                }
                userCache.set(data.id, obj)
                app.ports.infoForElm.send({ tag: "AvatarReceived", data: obj })
              }
              else {
                console.error("ERROR on avatar", err)
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
              console.error('ERROR: ' + err)
            }
            else {
              console.log('web', data)
            }
          })
          break
        case "OpenOptionsPage":
          browser.runtime.openOptionsPage()
          break
      }
    })
  }

  async function openScuttleShellOrSettings() {
    let el = document.body
    let config = JSON.parse(localStorage.getItem("config")) || {
      remote: "",
      keys: "",
      manifest: ""
    }
    el.innerHTML = ""
    config.keys = JSON.stringify(config.keys)
    config.manifest = JSON.stringify(config.manifest)

    if (typeof browser !== "undefined") {
      sendBackgroundCommand("start-scuttle-shell")
    } else {
      window.location.hash = "#/settings"
      app = Main.embed(el, config)
      await initializePortSubscriptions()
    }
  }

  async function getCurrentUserAvatar() {
    try {
      avatar(sbot, sbot.id, sbot.id, (err, data) => {
        if (data) {
          let obj = {
            id: data.id,
            name: data.name,
            image: "http://localhost:8989/blobs/get/" + data.image
          }
          userCache.set(data.id, obj)
          app.ports.infoForElm.send({ tag: "CurrentUser", data: obj })
        }
        else {
          console.error("ERROR on avatar", err)
        }
      })
    } catch (e) {
      console.error("ERROR on avatar", e)
    }
  }

  function startSSBClient(remote, keys, manifest) {
    // console.log("k", keys)
    // console.log("remote", remote)
    // console.log("manifest", manifest)
    // console.log("caps", config.caps)

    return new Promise((resolve, reject) => {
      client(keys, {
        remote: remote,
        caps: config.caps,
        manifest: manifest
      }, (err, s) => {

        if (err) {
          console.log("error in client", err)
          reject(err)
          return false
        }

        avatar(s, s.id, s.id, (err, data) => {
          console.log("data", data)
          console.log("err", err)
          if (data) {
            let obj = {
              id: data.id,
              name: data.name,
              image: "http://localhost:8989/blobs/get/" + data.image
            }
            userCache.set(data.id, obj)
            resolve(s)
            return true
          }
          else {
            reject(err)
            return false
          }
        })
      })
    })
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

  await launchApp()
}

//main()

console.log("hello");
