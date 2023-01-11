const identities = require("../common/identities.js")

function setup(program) {
  const cmd = program
  .command("identity")
  .description(`commands to manage SSB identities`)

  cmd
    .command("list")
    .description("show current available identities.")
    .action(() => {
      const t = identities.list()
      if (t.length == 0) {
        console.log("No identities available")
      } else {
        console.log(`Identities:`)
        t.forEach(i => console.log(`\t@${i.public}`))
      }
    })

  cmd
    .command("create")
    .description("creates a new identity.")
    .action(() => {
      const t = identities.create()
      console.log(`Identity created: @${t.public}\nLocation: ${t.path}`)
    })

  cmd
    .command("remove <id>")
    .description("removes an identity.")
    .action(id => {
      const b = identities.remove(id)

      if (b) {
        console.log(`Identity ${id} removed.`)
      }else{
        console.log(`Problem removing ${id}.`)
      }
    })
}

module.exports = { setup }
