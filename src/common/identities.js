const _ = require("lodash")
const paths = require("./paths.js")
const fs = require("fs-extra")
const os = require("os")
const path = require("path")
const preferences = require("./preferences.js")
const ssbKeys = require("ssb-keys")

const identitiesFolder = path.join(paths.data, "identities")

function create() {
  const tempPath = path.join(identitiesFolder, "temp")
  const secretPath = path.join(tempPath, "secret")

  fs.ensureDirSync(tempPath)

  const keys = ssbKeys.loadOrCreateSync(secretPath)
  const newPath = path.join(identitiesFolder, _.kebabCase(keys.public.slice(0,10)))

  fs.renameSync(tempPath, newPath)

  return {public: keys.public, path: newPath}
}

function remove(identity) {

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
  list
}
