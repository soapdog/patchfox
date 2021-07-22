patchfox.package({
  name: "githubIntegration",
  supportedPlatforms: ["nodejs-ssb"],
  menu: [
    {
      group: "Help",
      label: "GitHub",
      items: [
        {
          label: "View Issues",
          event: "url:open",
          data: "https://github.com/soapdog/patchfox/issues"
        },
        {
          label: "Source Code",
          event: "url:open",
          data: "https://github.com/soapdog/patchfox/"
        }
      ]
    }
  ]
});
