const ProfileView = require("./Profile.svelte");
const ContactCard = require("./ContactCard.svelte");
const AboutCard = require("./AboutCard.svelte");

patchfox.package({
  name: "contacts",
  profile: ProfileView,
  messageTypes: [
    {
      type: "contact",
      card: ContactCard
    },
    {
      type: "about",
      validator: msg => !msg.value.content.about.startsWith("%"),
      card: AboutCard
    }
  ],
  menu: {
    group: "Contacts",
    items: [
      {
        label: "Your Profile",
        event: "package:go",
        data: {
          pkg: "contacts",
          view: "profile"
        }
      }
    ]
  }
})
