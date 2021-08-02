patchfox.package({
  name: "openCollectiveIntegration",
  supportedPlatforms: ["all"],
  menu: [
    {
      group: "Help",
      label: "Open Collective",
      items: [
        {
          label: "Join Patchfox OC",
          event: "url:open",
          data: "https://opencollective.com/patchfox"
        }
      ]
    }
  ]
});
