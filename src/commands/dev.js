const toml = require("@iarna/toml")
const fs = require("fs")
const path = require("path")
const mkdirp = require("mkdirp")
const paths = require("../common/paths.js")

const preferences = require("../common/preferences.js")

function setup(program) {
  const cmd = program.command("dev").description("commands that help development of Patchfox")

  cmd
    .command("create-method <name>")
    .description("creates a new RPC method.")
    .action(methodName => {
      let methodPath = `./src/api/` + methodName.replaceAll(".", "/") + ".js"
      if (fs.existsSync(methodPath)) {
        console.log("Sorry, method already exists.")
        return
      }

      console.log(`Creating ${methodPath}...`)
      let folder = path.dirname(methodPath)
      if (!fs.existsSync(folder)) {
        mkdirp.sync(folder)
      }
      const methodNameSansNamespace = path.basename(methodPath).replace(".js", "")
      const template = `
/**
 * Remember to place your error in "err" and your result value in "result"
 */
const api = require("../../common/ssb/api.js")
const lori = require("lori")

async function ${methodNameSansNamespace}(params, callback) {
  let err = false
  let result = false
  const identity = params[0]?.identity
  
  if (err) {
    callback(err, null)
  } else {
    callback(null, result)
  }
}

module.exports = ${methodNameSansNamespace}
`
      fs.writeFileSync(methodPath, template)
      console.log(`OK: ${methodPath}`)
    })

  cmd
    .command("list-paths")
    .description("list paths used by Patchfox.")
    .action(() => {
      console.log(`Paths:`)
      for (k in paths) {
        console.log(`\t${k}: ${paths[k]}`)
      }
    })
}

module.exports = { setup }
