const PubSub = require("pubsub-js")

const unloadEventUrlOpen = PubSub.subscribe("url:open", (msg, data) => {
  window.open(data)
})

module.exports = {
  unloadEventUrlOpen
}
