const _ = require("lodash")
const paths = require("./paths.js")
const fs = require("fs-extra")
const os = require("os")
const path = require("path")
const preferences = require("./preferences.js")
const ssbKeys = require("ssb-keys")
const toml = require("@iarna/toml")


const identitiesFolder = path.join(paths.data, "identities")

const minimalConfig = {
  autostart: true
}

function pathForIdentity(id) {
    if (id[0] === "@") {
      id = id.slice(1)
    }
    const newPath = path.join(identitiesFolder, _.kebabCase(id.slice(0,10)))
    return newPath
}

function create() {
  const tempPath = path.join(identitiesFolder, "temp")
  const secretPath = path.join(tempPath, "secret")

  fs.ensureDirSync(tempPath)

  const keys = ssbKeys.loadOrCreateSync(secretPath)
  const newPath = pathForIdentity(keys.public)

  fs.renameSync(tempPath, newPath)

  const configFile = path.join(newPath, "config.toml")
  fs.writeFileSync(configFile, toml.stringify(minimalConfig))

  return {public: keys.public, path: newPath}
}

function remove(identity) {
  const p = pathForIdentity(identity)

  if (fs.existsSync(p)) {

    fs.removeSync(p)
    return true
  } else {
    return false
  }
}

function list() {
  const isDirectory = i => fs.lstatSync(i).isDirectory()
  const everything = fs.readdirSync(identitiesFolder)

  const identities = everything
    .map(i => path.join(identitiesFolder, i))
    .filter(isDirectory)
    .map(f => {
      const s = path.join(f, "secret")
      const keys = ssbKeys.loadOrCreateSync(s)
      return keys
    })

  return identities
}

module.exports = {
  create,
  remove, 
  list,
  pathForIdentity
}
