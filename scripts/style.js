var fs = require('fs')
var path = require('path')

fs.writeFileSync(
  path.join(__dirname, '..', 'components/main-interface/style.css.json'),
  JSON.stringify(fs.readFileSync(path.join(__dirname, '..', 'components/main-interface/style.css'), 'utf8'))
)
