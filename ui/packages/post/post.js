const PostCompose = {view: m("p","Not")} // require("./PostCompose.js")
const PostCard = require("./PostCard.js")

patchfox.package({
  name: "post",
  supportedPlatforms: ["nodejs-ssb"],
  view: PostCompose,
  //compose: PostCompose,
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
