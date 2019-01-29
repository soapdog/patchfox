const h = require('mutant/h')
const nest = require('depnest')

exports.needs = nest('message.html', {
  backlinks: 'first',
  author: 'first',
  meta: 'map',
  timestamp: 'first'
})

exports.gives = nest('message.html.layout')

exports.create = (api) => {
  return nest('message.html.layout', messageLayout)

  function messageLayout (msg, opts) {
    if (opts.layout !== 'mini') return
    return h('div', {
      classList: 'Message -mini'
    }, [
      h('header.author', {}, api.message.html.author(msg, { size: 'mini' })),
      h('section.timestamp', {}, api.message.html.timestamp(msg)),
      h('section.meta', {}, api.message.html.meta(msg)),
      h('section.content', {}, opts.content),
      h('section.raw-content')
    ])
  }
}
