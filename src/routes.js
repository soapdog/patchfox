const Public = require("./pages/public");
const Thread = require("./pages/thread");
const Test = require("./pages/test");
const rlite = require("rlite-router");
const h = require("mutant/html-element");
const refs = require("ssb-ref");

const NotFound = () => {
    return h("h1", "404: Not Found");
}

const Intercept = ({ encodedId }) => {
    let id = decodeURIComponent(encodedId).replace("ssb:", "");
    switch (id[0]) {
        case "#":
            window.location.hash = "channel/" + id.slice(1);
        case "%":
            if (!refs.isMsgId(id)) return false
            window.location.hash = "thread/" + encodeURIComponent(id);
        case "@":
            if (!refs.isFeedId(id)) return false
            window.location.hash = "feed/" + id;
        case "&":
            if (!refs.isBlobId(id)) return false
            window.location = "http://localhost:8989/blobs/get/" + id;
    }
    if (id.indexOf("javascript:") === 0) {
        return h("h1", "stop trying to inject JS here");
    }

    return h("h1", `intercepted: ${id}`);
}

let routes = rlite(NotFound, {
    "public": Public,
    "thread/:msgID": Thread,
    "test": Test,
    "intercept/*encodedId": Intercept
});

module.exports = routes;

