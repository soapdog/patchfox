const prefs = require("./prefs.js");
const utils = require("./utils.js");
const PubSub = require("pubsub-js");
const events = require("./events.js");
const menus = require("./menus.js");
const _ = require("lodash");
const queryString = require("query-string");

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

function stopListening(token) {
  PubSub.unsubscribe(token)
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

function go(pkg, view, data) {
  PubSub.publishSync("package:go", { pkg, view, data })
}

function reload(pkg, view, data) {
  let state = { pkg, view, ...data };
  let qs = queryString.stringify(state);
  location = `/index.html?${qs}`
}

module.exports = {
  // package related
  package,
  packages,
  systemPackages,
  go,
  reload,
  // menu related (aka navigation)
  ...menus,
  // event related
  emit,
  emitSync,
  listen,
  events,
  addEventIdentifier,
  stopListening,
  ...prefs,
  // aux
  utils
}
