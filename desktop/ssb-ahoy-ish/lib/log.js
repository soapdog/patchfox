const LABEL_WIDTH = 8
const LABEL_PAD = ' '

// signatures:
// log (tag: String, message: String) -> [ AHOY | tag ] message
// log (m1, m2, m3)                   -> [ AHOY ] m1 m2 m3

module.exports = function log () {
  var content = [ ...arguments ]

  if (content.length === 2) {
    if (content[0].length < LABEL_WIDTH) {
      content[0] = colorSecondary(' ' + content[0] + ' ') +
        new Array(LABEL_WIDTH - content[0].length - 2).fill(LABEL_PAD).join('')
    } else {
      content[0] = colorSecondary(' ' + content[0] + ' ')
    }
  } else {
    content.unshift(' ')
  }

  console.log(colorPrimary(' AHOY ') + '%s', content.join(' '))
}

function colorPrimary (string) {
  return '\x1b[37m\x1b[45m' + string + '\x1b[0m'
}

function colorSecondary (string) {
  return '\x1b[47m\x1b[35m' + string + '\x1b[0m'
  // background white
  // foreground magenta
}
