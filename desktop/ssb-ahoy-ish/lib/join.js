const path = require('path')

module.exports = function join () {
  const result = path.join.apply(null, arguments)

  if (process.platform.startsWith('win')) return result.replace(/\\/g, '/')

  return result
}
