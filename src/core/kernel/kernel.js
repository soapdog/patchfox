const prefs = require("./prefs.js");
const utils = require("./utils.js");
const abusePrevention = require("./abusePrevention.js");
const PubSub = require("pubsub-js");
const events = require("./events.js")
const _ = require("lodash");

let packages = {};

function package(pkg) {
    let name = pkg.name
    _.set(packages, name, pkg)
}

function emit(event, data) {
    PubSub.publish(event, data)
}

function emitSync(event, data) {
    PubSub.publishSync(event, data)
}

function listen(event, listener) {
    let token = PubSub.subscribe(event, listener);
    return token;
}

function addEventIdentifier(obj) {
    // hack: mutating globals for fun and profit
    // I'll regret this later.
    // warning: this can clobber existing events if the
    // keys collide. Maybe force it into a namespace?
    Object.assign(window.patchfox.events, obj)
}


module.exports = {
    // package related
    package,
    packages,
    // event related
    emit,
    listen,
    events,
    addEventIdentifier,
    // prefs
    setPref: prefs.setPref,
    getPref: prefs.getPref,
    // aux
    utils,
    abusePrevention
}