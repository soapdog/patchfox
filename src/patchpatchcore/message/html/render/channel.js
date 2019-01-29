var h = require('mutant/h')
var nest = require('depnest')
var extend = require('xtend')

exports.needs = nest({
  'message.html': {
    decorate: 'reduce',
    layout: 'first',
    link: 'first',
    markdown: 'first'
  }
})

exports.gives = nest({
  'message.html': {
    canRender: true,
    render: true
  }
})

exports.create = function (api) {
  return nest('message.html', {
    canRender: isRenderable,
    render: channel
  })

  function channel (msg, opts) {
    if (!isRenderable(msg)) return
    var element = api.message.html.layout(msg, extend({
      content: renderContent(msg),
      layout: 'mini'
    }, opts))

    return api.message.html.decorate(element, {
      msg
    })
  }

  function renderContent (msg) {
    var channel = '#' + msg.value.content.channel
    return [
      msg.value.content.subscribed ? 'subscribed to channel' : 'unsubscribed from channel', ' ', h('a.channel', {
        href: channel
      }, channel)
    ]
  }

  function isRenderable (msg) {
    return msg.value.content.type === 'channel' ? true : undefined
  }
}
