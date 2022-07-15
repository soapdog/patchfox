const PostCompose = require("./PostCompose.js")
const PostCard = require("./PostCard.js")

patchfox.package({
  name: "post",
  supportedPlatforms: ["nodejs-ssb"],
  view: PostCompose,
  compose: PostCompose,
  messageTypes: [
    {
      type: "post",
      card: PostCard,
      //compose: PostCompose
    }
  ],
  menu: [
    {
      group: "Compose",
      items: [
        {
          label: "New Post",
          event: "package:go",
          shortcut: "CmdOrCtrl+N",
          data: {
            pkg: "post",
            view: "compose"
          }
        }
      ]
    },
    {
      group: "Compose",
      items: [
        {
          label: "New Post in New Window",
          event: "package:open",
          shortcut: "CmdOrCtrl+Alt+N",
          data: {
            pkg: "post",
            view: "compose"
          }
        }
      ]
    }     
  ]
})
