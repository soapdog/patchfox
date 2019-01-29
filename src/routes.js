const rlite = require("rlite-router");
const h = require("mutant/html-element");
const refs = require("ssb-ref");
const api = require("./api");


const NotFound = () => {
    return h("h1", "404: Not Found");
};

const Intercept = ({ encodedId }) => {
    let id = decodeURIComponent(encodedId).replace("ssb:", "");
    switch (id[0]) {
    case "#":
        window.location.hash = "channel/" + id.slice(1);
        break;
    case "%":
        if (!refs.isMsgId(id)) return false;
        window.location.hash = "thread/" + encodeURIComponent(id);
        break;
    case "@":
        if (!refs.isFeedId(id)) return false;
        window.location.hash = "feed/" + id;
        break;
    case "&":
        if (!refs.isBlobId(id)) return false;
        window.location = "http://localhost:8989/blobs/get/" + id;
        break;
    }

    if (id.indexOf("javascript:") === 0) {
        return h("h1", "stop trying to inject JS here");
    }

    return h("p", `loading ${id}...`);
};

let routes = rlite(NotFound, {
    "public": api.app.page.public,
    "thread/*msgID": api.app.page.thread,
    "test": api.app.page.test,
    "intercept/*encodedId": Intercept
});

module.exports = routes;

