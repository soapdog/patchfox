const util = require('./util')

const defaults = {
  imageLink: ref => ref,
  toUrl: ref => ref,
  protocols: []
}

let config = {}

const md = require('markdown-it')()
  .use(require('markdown-it-emoji'))

// emoji
const oldEmojiRender = md.renderer.rules.emoji || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}
md.renderer.rules.emoji = function (tokens, idx) {
  if (config.emoji) {
    const emoji = tokens[idx].markup
    return config.emoji(emoji)
  } else {
    return oldEmojiRender(tokens, idx)
  }
}

// links
md.renderer.rules.link_open = () => ''
md.renderer.rules.link_close = () => ''

// code
md.renderer.rules.code_inline = (tokens, idx) => {
  return tokens[idx].content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// image
md.renderer.rules.image = (tokens, idx) => {
  return tokens[idx].content
}
module.exports = (text, opts) => {
  config = Object.assign({}, defaults, opts)
  return util.replaceNewlines(md.renderInline('' + (text || '')))
}
