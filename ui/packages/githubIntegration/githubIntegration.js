patchfox.package({
  name: "githubIntegration",
  title: "Github Integration",
  supportedPlatforms: ["all"],
  menu: [
    {
      group: "Help",
      label: "GitHub",
      items: [
        {
          label: "View Issues on Github",
          event: "url:open",
          data: "https://github.com/soapdog/patchfox/issues"
        },
        {
          label: "Source Code on Github",
          event: "url:open",
          data: "https://github.com/soapdog/patchfox/"
        }
      ]
    }
  ]
})
