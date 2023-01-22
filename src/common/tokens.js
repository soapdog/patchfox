const { v4: uuidv4 } = require("uuid")
const _ = require("lodash")

const preferences = require("./preferences.js")

function create() {
  let tokens = preferences.get("server.tokens", [])
  const token = uuidv4()
  tokens.push(token)
  preferences.set("server.tokens", tokens)
  return token
}

function isValid(token) {
  let tokens = preferences.get("server.tokens", [])
  
  return tokens.includes(token)
}

function remove(token) {
 let tokens = preferences.get("server.tokens", [])
 tokens = tokens.filter((p) => p !== token)
 preferences.set("server.tokens", tokens)
}

function list() {
  let tokens = preferences.get("server.tokens", [])
  return tokens 
}

module.exports = {
  create,
  remove, 
  isValid,
  list
}
