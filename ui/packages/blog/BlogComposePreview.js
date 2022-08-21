const m = require("mithril")
const { when } = require("../../core/kernel/utils.js")

const BlogComposePreview = {
  view: vnode => {
    let channel = vnode.attrs.channel
    let title = vnode.attrs.title
    let contentWarning = vnode.attrs.contentWarning
    let content = vnode.attrs.content
    let summary = vnode.attrs.summary
    let thumbnail = vnode.attrs.thumbnail

    const makeFieldDisplay = (label, value) => {
      if (value) {
        return m("p", [m("b", `${label}: `), m("span", value)])
      } else {
        return null
      }
    }
    return m("article.prose", [
      m("h2", "Blog post preview"), 
      makeFieldDisplay("Channel", channel),
      makeFieldDisplay("Content Warning", contentWarning),
      makeFieldDisplay("Title", title),
      makeFieldDisplay("Summary", m.trust(ssb.markdown(summary))),
      when(thumbnail, m("p", [
        m("b", "Thumbnail: "),
        m("img.thumbnail-preview", {
          src: patchfox.blobUrl(thumbnail)
        })
      ])),
      m.trust(ssb.markdown(content))
    ])
  },
}

module.exports = BlogComposePreview
