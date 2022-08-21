const BlogCompose = require("./BlogCompose.js")
const BlogCard = require("./BlogCard.js")
const BlogApp = require("./BlogApp.js")
const BlogImport = require("./BlogImport.js")

patchfox.package({
  name: "blog",
  app: true,
  icon: "web-page.svg",
  supportedPlatforms: ["nodejs-ssb"],
  view: BlogApp,
  import: BlogImport,
  compose: BlogCompose,
  messageTypes: [
    {
      type: "blog",
      card: BlogCard,
      compose: BlogCompose
    }
  ],
  menu: [
    {
      group: "Compose",
      items: [
        {
          label: "New Blog Post",
          event: "package:go",
          data: {
            pkg: "blog",
            view: "compose"
          }
        },
        {
          label: "New Blog Post in a New Window",
          event: "package:open",
          data: {
            pkg: "blog",
            view: "compose"
          }
        }
      ]
    }
  ]
})
