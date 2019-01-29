const nest = require('depnest')

exports.gives = nest('message.html.decorate')

exports.create = (api) => {
  return nest('message.html.decorate', function (element, { msg }) {
    element.dataset.id = msg.key
    return element
  })
}
