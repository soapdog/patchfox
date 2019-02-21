const {isMsgId, isFeedId, isBlobId} = require("ssb-ref");
const nest = require("depnest");
const rlite = require("rlite-router");
const { h } = require("mutant");

exports.gives = nest("router.sync.routes");

exports.needs = nest({
    "app.page": {
        "thread": "first",
        "public": "first",
        "feed": "first",
        "test": "first"
    },
    "keys.sync.id": "first"
});

exports.create = (api) => {
    return nest("router.sync.routes", () => {
    
        const NotFound = () => {
            return h("h1", "404: Not Found");
        };

        const Intercept = ({ encodedId }, _state, _url) => {
            let id = decodeURIComponent(encodedId).replace("ssb:", "");
            switch (id[0]) {
            case "#":
                window.location.hash = "channel/" + id.slice(1);
                break;
            case "%":
                if (!isMsgId(id)) {
                    console.error(`intercept url should been a msg but it is not: ${id}`);
                    return false;
                }
                window.location.hash = "thread/" + encodeURIComponent(id);
                break;
            case "@":
                if (!isFeedId(id)) {
                    console.error(`intercept url should been a feed but it is not: ${id}`);
                    return false;
                }
                window.location.hash = "feed/" + encodeURIComponent(id);
                break;
            case "&":
                if (!isBlobId(id)) {
                    console.error(`intercept url should been a blob but it is not: ${id}`);
                    return false;
                }
                window.location = "http://localhost:8989/blobs/get/" + id;
                break;
            }

            if (id.indexOf("javascript:") === 0) {
                return h("h1", "stop trying to inject JS here");
            }

            return h("p", `loading ${id}...`);
        };

        const routes = rlite(NotFound, {
            "public": api.app.page.public,
            "thread/*msgID": api.app.page.thread,
            "feed/*feedID": api.app.page.feed,
            "test": api.app.page.test,
            "intercept/*encodedId": Intercept
        });

        return routes;
    }); 
};


