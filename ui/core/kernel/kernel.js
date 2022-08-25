const prefs = require("./prefs.js")
const utils = require("./utils.js")
const PubSub = require("pubsub-js")
const events = require("./events.js")
const menus = require("./menus.js")
const _ = require("lodash")
const queryString = require("query-string")
const path = require("path")

let packages = {}

function _package(pkg) {
  let name = pkg.name
  let ssb = global.ssb
  if (pkg.supportedPlatforms.includes("all")) {
    console.log(`Loading package ${pkg.name} because it supports *all* platforms.`)
    _.set(packages, name, pkg)
  } else if (pkg.supportedPlatforms.includes(ssb?.platform)) {
    console.log(`Loading package ${pkg.name}`)
    _.set(packages, name, pkg)
  } else {
    console.error(`Not loading package ${pkg.name}`, ssb)
  }
}

function emit(event, data) {
  PubSub.publish(event, data)
}

function emitSync(event, data) {
  PubSub.publishSync(event, data)
}

function listen(event, listener) {
  let token = PubSub.subscribe(event, listener)
  return token
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

function appPackages() {
  return _.filter(patchfox.packages, p => p.app)
}

function go(pkg, view, data) {
  let cs = queryString.parse(location.search)
  if (cs.identity && !data.identity) {
    data.identity = cs.identity
  }
  if (typeof view === "undefined") {
    view = "view"
  }
  PubSub.publishSync("package:go", { pkg, view, data })
}

function addHistory(pkg, view, data) {
  if (typeof data === "undefined") {
    data = {}
  }
  let cs = queryString.parse(location.search)
  let state = { pkg, view, ...data }
  if (cs.identity) {
    state.identity = cs.identity
  }
  let qs = queryString.stringify(state)
  history.pushState({ pkg, view, data }, "", `?${qs}`)
}

function reload(pkg, view, data) {
  let cs = queryString.parse(location.search)
  if (cs.identity && !data.identity) {
    data.identity = cs.identity
  } 
  let state = { pkg, view, ...data }
  let qs = queryString.stringify(state)
  location = `?${qs}`
}

function url(pkg, view, data) {
  let cs = queryString.parse(location.search)
  if (cs.identity && !data.identity) {
    data.identity = cs.identity
  }
  let state = { pkg, view, ...data }
  let qs = queryString.stringify(state)
  return `file://${__dirname}/../../index.html?${qs}`
}

function packageForType(msg) {
  let messageTypes = []

  let packagesForMessageTypes = _.filter(
    patchfox.packages,
    p => p.messageTypes
  )

  let type

  const makeGenericValidatorForType = typeToBuildFor => {
    return msg => {
      let type
      if (typeof msg.value.content === "string") {
        type = "private"
      } else {
        type = msg.value.content.type
      }
      return type === typeToBuildFor
    }
  }

  packagesForMessageTypes.forEach(p => {
    p.messageTypes.forEach(mt => {
      let type = mt.type
      let view = mt.card
      let short = mt.short || false
      let validator = mt.validator || makeGenericValidatorForType(type)
      messageTypes.push({ type, validator, view, short, pkg: p })
    })
  })

  let selectedPackage = false

  if (typeof msg.value.content === "string") {
    type = "private"
  } else {
    type = msg.value.content.type
  }

  for (let p of messageTypes) {
    if (p.validator(msg)) {
      selectedPackage = p.pkg
      break
    }
  }

  return selectedPackage
}

module.exports = {
  // package related
  package: _package, // fucking reserved word.
  packages,
  systemPackages,
  appPackages,
  packageForType,
  go,
  addHistory,
  url,
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
  ...utils
}
