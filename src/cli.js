#!/usr/bin/env node

const { Command } = require("commander")
const pkg = require("../package.json")
const lori = require("lori")
const paths = require("./common/paths.js")
const preferences = require("./common/preferences.js")
const server = require("./server.js")

preferences.initialize()

const commands = [
  require("./commands/show.js"),
  require("./commands/token.js"),
  require("./commands/identity.js"),
  require("./commands/server.js"),
  require("./commands/dev.js"),
]

const program = new Command()

program
  .name('patchfox')
  .description('A minimalist server and client for Secure Scuttlebutt.')
  .version(pkg.version)

commands.forEach(c => c.setup(program))

program.parse()
