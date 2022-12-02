const lori = require("lori")
const xmlrpc = require("express-xmlrpc")
const { collectMethodsForXMLRPC } = require("./utils.js")
const tokens = require("./common/tokens.js")

function startXMLRPCServer(app) {
  lori.info("XML-RPC Server on /xmlrpc")
  app.use(xmlrpc.bodyParser)

  const methods = collectMethodsForXMLRPC(xmlrpc)

  app.post("/xmlrpc", (req, res) => {
    const request = req.body
    const token = req.token

    // if the check below is uncommented, this XML-RPC server will not pass validation
    // because the validator does not send a valid token with it.
    if (!tokens.isValid(token)) {
      res.send(xmlrpc.serializeFault(-32100, `Not authorized`))
      lori.debug("Unauthorized access attempt")
      return
    }

    try {
    xmlrpc.apiHandler(methods)(req, res)
  } catch(n) {
    res.send(xmlrpc.serializeFault(-32500, "Exception happened."))
  }

  })
}

module.exports = startXMLRPCServer
