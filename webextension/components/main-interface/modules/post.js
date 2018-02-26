var h = require('hyperscript')
var markdown = require('ssb-markdown')
var ref = require('ssb-ref')

exports.gives = {
  message: {
    render: true
  }
}

exports.create = function () {
  return { message: { render: function (msg) {
    if(msg.content.type != 'post') return

    content = msg.content

    var mentions = {}
    if(Array.isArray(content.mentions))
      content.mentions.forEach(function (link) {
        if(link.name) mentions[link.name] = link.link
      })

    var md = h('div.markdown')
    md.innerHTML = markdown.block(content.text, {
      toUrl: function (url, image) {
        //if(url[0] == '%') return '#' + url
        if(ref.isBlob(url)) return 'http://localhost:8989/blobs/get/'+url
        else return url
      }
    })
    return md

  }}}
}

