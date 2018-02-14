var h = require('hyperscript')
var human = require('human-time')

exports.needs = {
  message: { render: 'first', action: 'map', meta: 'map'},
  avatar: {image: 'first', name: 'first'},
  message_link: 'first'
}

exports.gives = {
  message: {action: true, meta: true, layout: true}
}

exports.create = function (api) {
  function noop () {}
  return {
    message: {
      //TODO: implement a "optional" thing for depject so don't get errors when
      //a give isn't actually needed.
      //call the layout and add to the DOM.
      action: noop,
      meta: noop,

      layout: function (data, context) {
        var re

        if (data.value.content.root) {
          var re = h('span', 're: ', api.message_link(data.value.content.root))
        }

        return h('div.message', 
          h('span.timestamp', h('a', {href: data.key}, human(new Date(data.value.timestamp)))),
          h('div.Avatar',
            h('a', {href: data.value.author},
              api.avatar.image(data.value.author)
            ),
            h('a', {href: data.value.author},
              api.avatar.name(data.value.author)
            )
          ),
          re,
          api.message.render(data.value),
          h('div.MessageMeta', api.message.meta(data, context)),
          h('div.Message__actions', api.message.action(data, context))
        )
      }
    }
  }
}


