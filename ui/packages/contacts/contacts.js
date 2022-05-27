const ProfileView = require("./Profile.js")
const ContactCard = require("./ContactCard.js")
const AboutCard = require("./AboutCard.js")

patchfox.package({
  name: "contacts",
  supportedPlatforms: ["nodejs-ssb"],
  profile: ProfileView,
  messageTypes: [
    {
      type: "contact",
      card: ContactCard,
      short: true,
    },
    {
      type: "about",
      validator: (msg) =>
        msg.value.content &&
        msg.value.content.about &&
        !msg.value.content.about.startsWith("%"),
      card: AboutCard,
    },
  ],
  menu: {
    group: "Contacts",
    label: "You",
    items: [
      {
        label: "Profile",
        event: "package:go",
        data: {
          pkg: "contacts",
          view: "profile",
        },
      },
      {
        label: "Friends",
        event: "package:go",
        data: {
          pkg: "contacts",
          view: "profile",
          data: {
            currentSubView: "friends",
          },
        },
      },
      {
        label: "Following",
        event: "package:go",
        data: {
          pkg: "contacts",
          view: "profile",
          data: {
            currentSubView: "following",
          },
        },
      },
      {
        label: "Followers",
        event: "package:go",
        data: {
          pkg: "contacts",
          view: "profile",
          data: {
            currentSubView: "followers",
          },
        },
      },
    ],
  },
})