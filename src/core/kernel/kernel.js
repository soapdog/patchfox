const prefs = require("./prefs.js");
const utils = require("./utils.js");
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

function systemPackages() {
    return _.filter(patchfox.packages, p => p.system)
}

function menus() {
    let packagesWithGlobalMenuEntries = _.filter(patchfox.packages, p => p.menu)
    return packagesWithGlobalMenuEntries.map(p => {
        return {
            name: p.name,
            menu: p.menu
        }
    }) 
}

function goToPackage(package) {
    // TODO: implement this.
}

function triggerMenu(menuItem) {
    let {package, event} = menuItem
    goToPackage(package)
    emitSync(event)
}

module.exports = {
    // package related
    package,
    packages,
    systemPackages,
    // menu related (aka navigation)
    menus,
    triggerMenu,
    // event related
    emit,
    listen,
    events,
    addEventIdentifier,
    ...prefs,
    // aux
    utils
}