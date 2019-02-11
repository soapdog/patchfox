const combine = require("depject");
const patchpatchcore = require("./patchpatchcore");
const patchcore = require("patchcore");
const entry = require("depject/entry");
const nest = require("depnest");
const bulk = require("bulk-require");

// Delete patchcore modules that need to be replaced
// with our own.
delete patchcore.patchcore.config;
delete patchcore.patchcore.keys;
delete patchcore.patchcore.sbot;
delete patchcore.patchcore.message.html;


const  patchfox = {
    app: bulk(__dirname, [ "app/**/*.js" ]),
    router: bulk(__dirname, [ "router/**/*.js" ]),
};

const args = [ patchfox, patchpatchcore, patchcore ];
// plugings loaded first will over-ride core modules loaded later
const sockets = combine.apply(null, args);

const api = entry(sockets, nest({
    "app.html.app": "first"
}));


module.exports = api;
