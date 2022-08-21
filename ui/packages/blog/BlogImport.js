const m = require("mithril")
const { when } = require("../../core/kernel/utils.js")
const Spinner = require("../../core/components/Spinner.js")
const Parser = require("rss-parser")
const parser = new Parser()
const TurndownService = require("turndown")
const turndownService = new TurndownService()

const BlogImport = {
  oninit: vnode => {
    vnode.state.feedUrl = localStorage.getItem("blog-import-feed") || ""
    vnode.state.feed = false
    vnode.state.loading = false
  },
  view: vnode => {
    let feedUrl = vnode.state.feedUrl 
    let feed = vnode.state.feed 
    let loading = vnode.state.loading 

    const fetchFeed = () => {
      vnode.state.loading = true
      m.redraw()

      parser.parseURL(feedUrl).then(f => {
        vnode.state.loading = false
        vnode.state.feed = f

        localStorage.setItem("blog-import-feed", feedUrl)
        console.log("feed", vnode.state.feed)
        m.redraw()
      })
    }

    const makeItemCard = item => {
      return m(".card.shadow.mb-4", m(".card-body", [
        m("h1.card-title.text-md", item.title),
        m("h2.card-subtitle.font-thin.mb-4", item.pubDate),
        m(".prose", [
          when(item.contentSnippet, m.trust(item.contentSnippet)),
          when(item.summary, m.trust(item.summary))
        ]),
        m(".card-actions.justify-end", [
          m("a.btn", {
            href: patchfox.url("blog", "compose", {
              content: turndownService.turndown(item.content ? item.content : item.summary),
              summary: item.contentSnippet ?? item.summary,
              title: item.title
            })
          }, "Compose new blog post using this content")
        ])
      ]))
    }

    const feedContainer = feed ? m(".container", [
      m(".card.bordered.bg-base-200", m(".card-body", [
        m(".card-title.uppercase", feed.title),
        m("a.card-subtitle.text-md", {href: feed.link}, feed.link),
        m("p.prose", feed.description ?? "No description given.")
      ])),
      m("br"),
      m("br"),
      feed.items.map(item => makeItemCard(item))
    ]) : null

    return m(".container", [
      m("h1.h1.uppercase.font-medium.text-xl", "Import RSS/Atom"),
      m(".form-control", [
        m("label.label", m("span.label-text", "RSS or ATOM URL")),
        m("input.input.input-bordered", {
          type: "text",
          value: feedUrl,
          placeholder: "URL to the feed",
          onchange: (ev) => {
            vnode.state.feedUrl = ev.target.value
          }
        })
      ]),
      m("button.btn.btn-primary.mt-2", {
        onclick: fetchFeed
      }, "Fetch"),
      m("br"),
      m("br"),
      when(vnode.state.loading, m(Spinner)),
      when(vnode.state.feed, feedContainer)
    ])
  },
}

module.exports = BlogImport
