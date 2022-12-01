const toml = require("@iarna/toml")
const fs = require("fs")
const path = require("path")

const startServer = require("../server.js")
const tokens = require("../common/tokens.js")
const preferences = require("../common/preferences.js")
const { JsonRPCClientWithToken } = require("../utils.js")

function setup(program) {
  const cmd = program.command("server")

  cmd
    .command("start")
    .description("Starts Patchfox server.")
    .action(() => {
      startServer()
    })

  cmd
    .command("stop")
    .description("Stops Patchfox server.")
    .action(() => {
      const token = tokens.list()[0] // get a valid token
      const port = preferences.get("server.port", 3000)
      const url = `http://localhost:${port}/jsonrpc`
      const client = JsonRPCClientWithToken(url, token)

      console.log(`Attempting to shutdown server at ${url}...`)
      client.request("shutdown", null, function (err, error, result) {
        if (error) {
          console.error(error)
          return
        }

        if (result) {
          console.log("Server is shutting down.")
          return
        }

        if (err) {
          switch (err.code) {
            case "ECONNREFUSED":
              console.log("Connection refused")
              return
              break
            default:
              console.log("An unknown error happened.")
              console.error(err)
              break
          }
        }
      })
    })
}

module.exports = { setup }
