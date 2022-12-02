const express = require("express")
const bearerToken = require("express-bearer-token")
const cors = require("cors")
const lori = require("lori")

const preferences = require("./common/preferences.js")
const startJsonRPCServer = require("./jsonrpc.js")
const startXMLRPCServer = require("./xmlrpc.js")

const app = express()
const port = preferences.get("server.port", 3000)

let server = null

function startServer() {
  app.use(lori.express())
  app.use(cors())
  app.use(bearerToken())

  if (preferences.get("protocols.jsonrpc", true)) {
    startJsonRPCServer(app)
  } else {
    lori.warn("JSON-RPC 2.0 Server disabled.")
  }

  if (preferences.get("protocols.xmlrpc", true)) {
    startXMLRPCServer(app)
  } else {
    lori.warn("XML-RPC Server disabled.")
  }

  app.get("/", (req, res) => {
    res.send("Hello World!")
  })

  server = app.listen(port, () => {
    lori.info(`Patchfox server listening on port ${port}`)
  })

  process.on("SIGTERM", () => {
    lori.debug("SIGTERM signal received: closing Patchfox server")
    server.close(() => {
      lori.debug("Patchfox server closed")
    })
  })
}

module.exports = startServer
