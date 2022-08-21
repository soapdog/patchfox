
const m = require("mithril")

const BlogApp = {
  view: vnode => {
    return m(".container", [
      m("h1.title.uppercase.font-medium.text-xl.mb-4", "Blogging Tools"),
      m("a.btn", {
        href: patchfox.url("blog", "import"),
        onclick: (ev) => {
          ev.preventDefault()
          patchfox.go("blog","import")
        }
      }, "Import from RSS/Atom")
    ])
  }
}

module.exports = BlogApp
