const PubSub = require("pubsub-js");


const unloadEventUrlOpen = PubSub.subscribe("url:open", (msg, data) => {
    console.log("opening url", data);
    window.open(data);
});

module.exports = {
    unloadEventUrlOpen
}