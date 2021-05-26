const BlogCompose = require("./BlogCompose.svelte");
const BlogCard = require("./BlogCard.svelte");
const BlogApp = require("./BlogApp.svelte");
const BlogImport = require("./BlogImport.svelte");

patchfox.package({
  name: "blog",
  app: true,
  icon: "web-page.svg",
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
          label: "Blog",
          event: "package:go",
          data: {
            pkg: "blog",
            view: "compose"
          }
        }
      ]
    }
  ]
})
