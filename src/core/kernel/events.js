const PubSub = require("pubsub-js");

// TODO: document events.


const unloadEventUrlOpen = PubSub.subscribe("url:open", (msg, data) => {
    console.log("opening url", data);
    window.open(data);
});

module.exports = {
    unloadEventUrlOpen
}