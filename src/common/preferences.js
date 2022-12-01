const fs = require("fs")
const path = require("path")
const mkdirp = require("mkdirp")
const toml = require("@iarna/toml")
const paths = require("./paths.js")
const _ = require("lodash")

const preferencesFile = path.join(paths.config, "patchfox.toml")

const defaultPreferences = {
  server: {
    port: 3000,
  },
  protocols: {
    jsonrpc: true,
    xmlrpc: true,
  },
}

let preferences = {}

function set(key, value) {
  _.set(preferences, key, value)
  savePreferences()
}

function get(key, defaultValue = false) {
  preferences = toml.parse(fs.readFileSync(preferencesFile))
  return _.get(preferences, key, defaultValue)
}

function savePreferences() {
  fs.writeFileSync(preferencesFile, toml.stringify(preferences))
}

function loadPreferences() {
    preferences = toml.parse(fs.readFileSync(preferencesFile)) 
}

function initialize() {
  if (!fs.existsSync(paths.config)) {
    mkdirp.sync(paths.config)
  }
  if (!fs.existsSync(preferencesFile)) {
    fs.writeFileSync(preferencesFile, toml.stringify(defaultPreferences))
  }

  loadPreferences()
}

function data() {
  return Object.assign(preferences)
}

module.exports = {
  initialize,
  set,
  get,
  data,
}
