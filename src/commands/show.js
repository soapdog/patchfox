const toml = require("@iarna/toml")
const fs = require("fs")
const path = require("path")

const preferences = require("../common/preferences.js")
const paths = require("../common/paths.js")

function setup(program) {
  const cmd = program.command("show")

  cmd
  .command("folders")
  .description("show where Patchfox stores data.")
  .action(() => {
    console.log(`Configuration: ${paths.config}`)
    console.log(`Data: ${paths.data}`)
  })

  cmd
  .command("preferences")
  .description("displays the current preferences.")
  .action(() => {
    console.log(toml.stringify(preferences.data()))
  })
}

module.exports = { setup }
