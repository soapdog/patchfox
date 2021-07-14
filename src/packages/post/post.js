const PostCompose = require("./PostCompose.svelte");
const PostCard = require("./PostCard.svelte");

patchfox.package({
  name: "post",
  supportedPlatforms: ["nodejs-ssb"],
  view: PostCompose,
  compose: PostCompose,
  messageTypes: [
    {
      type: "post",
      card: PostCard,
      compose: PostCompose
    }
  ],
  menu: [
    {
      group: "Compose",
      items: [
        {
          label: "Post",
          event: "package:go",
          data: {
            pkg: "post",
            view: "compose"
          }
        }
      ]
    }     
  ]
})
