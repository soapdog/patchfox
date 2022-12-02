const lori = require("lori")
const jayson = require("jayson")
const jsonParser = require("body-parser").json
const { collectMethodsForJSONRPC } = require("./utils.js")
const tokens = require("./common/tokens.js")

const methods = collectMethodsForJSONRPC()

const server = new jayson.Server(methods)

function startJsonRPCServer(app) {
  lori.info("JSON-RPC 2.0 Server on /jsonrpc")
  app.use(jsonParser())

  app.post("/jsonrpc", (req, res) => {
    const request = req.body
    const token = req.token 

    // lori.debug(req.headers)
    lori.debug(request)

    if (!tokens.isValid(token)) {
      res.status(403)
      res.send(`Not authorized`)
      lori.debug("Unauthorized access attempt")
      return
    }

    server.call(request, (err, result) => {
      if (err) {
        res.status(400)
        res.send(err)
        return
      }

      if (result) {
        res.send(result)
      } else {
        // empty result (could be a notification)
        res.status(204)
        res.send("")
      }
    })
  })
}

module.exports = startJsonRPCServer
