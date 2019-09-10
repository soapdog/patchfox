const profileView = require("./Profile.svelte");

patchfox.package({
  name: "contacts",
  profile: profileView,
  menu: {
    group: "Hub",
    label: "Contacts",
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
