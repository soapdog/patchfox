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
    let token = req.token 

    if (token === undefined) {
      if (request?.params[0] !== undefined) {
        token = request.params.shift()
      }
    }

    // lori.debug(req.headers)
    lori.debug(`token: ${token}`)
    lori.debug(request)

    if (!tokens.isValid(token)) {
      res.status(403)
      res.send(`Not authorized`)
      lori.debug("Unauthorized access attempt")
      return
    }

    server.call(request, (err, result) => {
      if (err) {
        lori.error(`Error (from callback): ${JSON.stringify(err)}`)
        res.status(400)
        res.send(err)
        return
      }

      if (result) {
        lori.debug(`Ok: ${JSON.stringify(result)}`)
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
