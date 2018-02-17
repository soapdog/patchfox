var fs = require('fs')
var path = require('path')

fs.writeFileSync(
  path.resolve('./components/main-interface/style.css.json'),
  JSON.stringify(fs.readFileSync('./components/main-interface/style.css', 'utf8'))
)
