const Public = require("./threads/public");
const Thread = require("./threads/thread");
const rlite = require("rlite-router");
const h = require("mutant/html-element");

const NotFound = () => {
    return h("h1","404: Not Found");
}

let routes = rlite(NotFound, {
    "public": Public ,
    "thread/:msgID": Thread
});

module.exports = routes;