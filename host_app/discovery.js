
module.exports = {
  name: 'sbot-discovery',
  version: '3.0.0',
  init: function (sbot) {
    sbot.ws.use(function (req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*')

      /// Server discovery ///
      if (req.url === '/get-address') {

        console.log("######### Discovery Request #############", req.headers.origin)

        res.end(JSON.stringify({
          status: "granted",
          server: sbot.ws.getAddress()
        }))

      } else {
        next()
      }
    })
  }
}
