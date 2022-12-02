const toml = require("@iarna/toml")
const fs = require("fs")
const path = require("path")
const mkdirp = require("mkdirp")

const preferences = require("../common/preferences.js")

function setup(program) {
  const cmd = program.command("dev")

  cmd
    .command("create-method <name>")
    .description("Creates a new RPC method.")
    .action((methodName) => {
      let methodPath = `./api/` + methodName.replace(".","/") + ".js"
      if (fs.existsSync(methodPath)) {
        console.log("Sorry, method already exists.")
        return
      }

      console.log(`Creating ${methodPath}...`)
      let folder = path.dirname(methodPath)
      if (!fs.existsSync(folder)) {
        mkdirp.sync(folder)
      }
      const methodNameSansNamespace = path.basename(methodPath).replace(".js","")
      const template = `
/**
 * Remember to place your error in "err" and your result value in "result"
 */
function ${methodNameSansNamespace}(params, callback) {

  if (err) {
    callback(err, null)
  } else {
    callback(result, null)
  }
}

module.exports = ${methodNameSansNamespace}
`
      fs.writeFileSync(methodPath, template)
      console.log(`OK: ${methodPath}`)
    })

}

module.exports = { setup }
