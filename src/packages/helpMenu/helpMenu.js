const version = browser.runtime.getManifest().version;
const releaseNotesUrl = browser.extension.getURL(`/docs/index.html#/release_notes/${version}`);


patchfox.package({
  name: "helpMenu",
  menu: [
    {
      group: "Help",
      items: [
        {
          label: "Documentation",
          event: "url:open",
          data: "/docs/index.html"
        },
        {
          label: "Troubleshooting",
          event: "url:open",
          data: "/docs/index.html#/troubleshooting/"
        },
        {
          label: "Release Notes",
          event: "url:open",
          data: releaseNotesUrl
        }
      ]
    }
  ]
});
