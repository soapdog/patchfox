const tokens = require("../common/tokens.js")

function setup(program) {
  const cmd = program.command("token")

  cmd
    .command("list")
    .description("show current available tokens.")
    .action(() => {
      const t = tokens.list()
      if (t.length == 0) {
        console.log("No tokens available")
      } else {
        console.log(`tokens: ${t}`)
      }
    })

  cmd
    .command("create")
    .description("creates a new token.")
    .action(() => {
      const t = tokens.create()
      console.log(`Token created: ${t}`)
    })

  cmd
    .command("remove <token>")
    .description("removes a token.")
    .action(token => {
      tokens.remove(token)
      console.log(`Token ${token} removed.`)
    })
}

module.exports = { setup }
