import { Main } from './Main.elm'
import client from 'ssb-client'
import config from 'ssb-config'
import ssbKeys from 'ssb-keys'
import avatar from 'ssb-avatar'
import "highlight.js"
import webresolve from 'ssb-web-resolver'
import toPull from 'stream-to-pull-stream'
import pull from 'pull-stream'

let app, sbot
let userCache = new Map()

const handleBackgroundResponse = (data) => {
  switch (data.type) {
    case "config":
      if (data.config.hasOwnProperty('secret')) {
        const keys = data.config.keys
        const remote = data.config.remote
        const manifest = data.config.manifest

        startSSBClient(keys, remote, manifest);
      }
      break
  }
}

const sendBackgroundCommand = (cmd, data) => {
  let sending = browser.runtime.sendMessage({ cmd, data })
  sending.then(handleBackgroundResponse, err => console.error(err))
}

function launchApp() {
  let el = document.getElementById('root')
  let config = JSON.parse(localStorage.getItem("config")) || {
    remote: "",
    keys: "",
    manifest: ""
  }
  el.innerHTML = ""
  app = Main.embed(el, config);

  if (config.remote !== "") {
    const remote = config.remote
    const keys = JSON.parse(config.keys)
    const manifest = JSON.parse(config.manifest)

    startSSBClient(keys, remote, manifest);
  }

  app.ports.infoForOutside.subscribe(msg => {
    switch (msg.tag) {
      case "SaveConfiguration":
        console.log("trying to save configuration", msg.data);

        localStorage.setItem("config", JSON.stringify(msg.data));

        const remote = msg.data.remote
        const keys = JSON.parse(msg.data.keys)
        const manifest = JSON.parse(msg.data.manifest)

        startSSBClient(keys, remote, manifest);
        break;
      case "CheckTypeAndRedirect":
        let id = encodeURIComponent(msg.data);
        sbot.get(msg.data, (err, data) => {
          if (data) {
            flog("msg", data);
            switch (data.content.type) {
              case "post":
                location.hash = `#/thread/${id}`;
                break;
              case "web-init":
                location.hash = `#/thread/${id}`;
                break;
              case "web-root":
                location.hash = `#/thread/${id}`;
                break;
            }
          }
          else {
            console.error("err", err);
          }
        });
        break;
      case "RelatedMessages":
        sbot.relatedMessages({ id: msg.data }, (err, msgs) => {
          if (msgs) {
            app.ports.infoForElm.send({ tag: "ThreadReceived", data: msgs });
          }
          else {
            console.error("ERROR on related messages", err);
          }
        });
        break;
      case "Avatar":
        if (userCache.has(msg.data)) {
          app.ports.infoForElm.send({ tag: "AvatarReceived", data: userCache.get(msg.data) });
        }
        else {
          avatar(sbot, sbot.id, msg.data, (err, data) => {
            if (data) {
              let obj = {
                id: data.id,
                name: data.name,
                image: "http://localhost:8989/blobs/get/" + data.image
              };
              userCache.set(data.id, obj);
              app.ports.infoForElm.send({ tag: "AvatarReceived", data: obj });
            }
            else {
              console.error("ERROR on avatar", err);
            }
          });
        }
        break;
      case "WebResolve":
        let components = [
          msg.data,
          "index.html"
        ];
        webresolve(sbot, components, function (err, data) {
          if (err) {
            console.error('ERROR: ' + err);
          }
          else {
            console.log('web', data);
          }
        });
        break;
      case "OpenOptionsPage":
        browser.runtime.openOptionsPage();
        break;
    }
  });
}

function startSSBClient(keys, remote, manifest) {
  client(keys, {
    remote: remote,
    caps: config.caps,
    manifest: manifest
  }, (err, s) => {
    sbot = s;
    if (err) {
      console.log(err.message);
      app.ports.infoForElm.send({ tag: "CantConnectToSBOT", data: err.message || "Failed to connect to SBOT" });
    } else {

      avatar(sbot, sbot.id, sbot.id, (err, data) => {
        if (data) {
          let obj = {
            id: data.id,
            name: data.name,
            image: "http://localhost:8989/blobs/get/" + data.image
          };
          userCache.set(data.id, obj);
          app.ports.infoForElm.send({ tag: "CurrentUser", data: obj });
        }
        else {
          console.error("ERROR on avatar", err);
        }
      });
    }
  });
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

launchApp();
