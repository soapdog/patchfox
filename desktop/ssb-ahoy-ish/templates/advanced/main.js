const { join } = require('path')
const ahoy = require('ssb-ahoy')

ahoy(
  `file://${join(__dirname, 'ui', 'index.html')}`,
  {
    title: 'example-ahoy',
    plugins: [
      require('ssb-db'),
      require('ssb-backlinks')
    ],
    config: {
      // path: join(__dirname, 'dev-data')
    }
  },
  (err, ssb) => {
    if (err) throw err

    console.log('ahoy started', ssb.id)

    // publish a message!
    ssb.publish(
      { type: 'success', time: new Date().toString() },
      (err, msg) => {
        if (err) throw err
        console.log(JSON.stringify(msg, null, 2))
      }
    )
  }
)
