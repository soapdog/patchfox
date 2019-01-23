const Public = require("./pages/public");
const Thread = require("./pages/thread");
const Test = require("./pages/test");
const rlite = require("rlite-router");
const h = require("mutant/html-element");

const NotFound = () => {
    return h("h1","404: Not Found");
}

let routes = rlite(NotFound, {
    "public": Public ,
    "thread/:msgID": Thread,
    "test": Test

});

module.exports = routes;