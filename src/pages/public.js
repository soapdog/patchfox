const combine = require('depject')
const apply = require('depject/apply')
const h = require('mutant/h')
const patchpatchcore = require("../patchpatchcore")
const patchcore = require("patchcore");
delete patchcore.patchcore.config;
delete patchcore.patchcore.keys;
delete patchcore.patchcore.sbot;

console.dir(patchcore)

const combined = combine([patchpatchcore, patchcore])
console.dir(combined)
var api = entry(combined)

const Public = () => {

    return h('div.App', [
        api.feed.html.render(api.feed.pull.public)
    ])
}

function entry(sockets) {
    return {
        feed: {
            html: {
                render: apply.first(sockets.feed.html.render)
            },
            pull: {
                public: apply.first(sockets.feed.pull.public)
            }
        }
    }
}
module.exports = Public;