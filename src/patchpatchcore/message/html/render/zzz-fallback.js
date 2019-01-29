var h = require('mutant/h')
var nest = require('depnest')
var extend = require('xtend')

exports.needs = nest({
  'message.html': {
    decorate: 'reduce',
    layout: 'first'
  }
})

exports.gives = nest('message.html.render')

exports.create = function (api) {
  return nest('message.html.render', renderMessage)

  function renderMessage (msg, opts) {
    var element = api.message.html.layout(msg, extend({
      content: renderContent(msg),
      layout: 'mini'
    }, opts))

    return api.message.html.decorate(element, { msg })
  }

  function renderContent (msg) {
    if (typeof msg.value.content === 'string') {
      return h('code', {}, 'PRIVATE')
    } else {
      return h('code', {}, msg.value.content.type)
    }
  }
}
