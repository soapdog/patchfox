const PubSub = require("pubsub-js");

// TODO: document events.


const unloadEventUrlOpen = PubSub.subscribe("url:open", (msg, data) => {
    window.open(data);
});

module.exports = {
    unloadEventUrlOpen
}