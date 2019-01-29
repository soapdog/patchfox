const combine = require("depject");
const patchpatchcore = require("./patchpatchcore");
const patchcore = require("patchcore");
const entry = require("depject/entry");
const nest = require("depnest");

// Delete patchcore modules that need to be replaced
// with our own.
delete patchcore.patchcore.config;
delete patchcore.patchcore.keys;
delete patchcore.patchcore.sbot;
delete patchcore.patchcore.contact.obs;
delete patchcore.patchcore.message.html;


const  pages = {
    public: require("./pages/public"),
    thread: require("./pages/thread"),
    test: require("./pages/test")
};

const args = [ pages, patchpatchcore, patchcore ];
// plugings loaded first will over-ride core modules loaded later
const sockets = combine.apply(null, args);

const api = entry(sockets, nest({
    "app.page.public": "first",
    "app.page.thread": "first",
    "app.page.test": "first",
}));
// This `api` should contain references to all routed pages. 
// it is used by routes.js to create the router.

module.exports = api;
