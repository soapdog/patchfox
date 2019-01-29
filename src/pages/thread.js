const nest = require("depnest");
const { h, Struct, computed, map, resolve, onceTrue } = require("mutant");
const last = require("lodash/last");
const get = require("lodash/get");

exports.gives = nest("app.page.thread");

exports.needs = nest({
    "feed.html.render": "first",
    "feed.obs.thread": "first",
    "message.html.render": "first",
});


exports.create = (api) => {
    return nest("app.page.thread", ({ msgID }) => {
        console.log("msgID", msgID);
        const { messages, isPrivate, rootId, lastId, channel, recps } = api.feed.obs.thread(msgID);

        const content = map(messages, m => {
            const message = api.message.html.render(resolve(m), { pageId: msgID });
            return message;
        }, { comparer });

        return h("div.App", [
            content
        ]);
    });
};


function comparer(a, b) {
    return get(resolve(a), "key") === get(resolve(b), "key");
}
