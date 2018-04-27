import './main.css'
import { Main } from './Main.elm'
import client from 'ssb-client'

let app

console.log("patchfox client trying to acquire remote")

function handleResponse(data) {
  console.log(`background script sent a response`, data)
  if (data.config.remote.length > 0) {
    console.log("Received new remote", data.config.remote)
    localStorage.setItem("remote", data.config.remote)
    localStorage.setItem("/.ssb/secret", data.config.secret)


    window.client = client
    client(function (err, sbot) {
      console.log("err", err)
      console.log("sbot", sbot)
      window.sbot = sbot
      sbot.whoami(cb => console.log("cb", cb))
    })
    console.log("foi")
  }

  app = Main.embed(document.getElementById('root'), {
    error: "",
    remote: data.remote
  })
}

function handleError(error) {
  console.log(`Error: ${error}`)
  app = Main.embed(document.getElementById('root'), {
    error: error.message,
    remote: ""
  })
}

let sending = browser.runtime.sendMessage({ cmd: "get-remote" })
sending.then(handleResponse, handleError)



