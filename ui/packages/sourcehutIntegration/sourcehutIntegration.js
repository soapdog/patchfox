patchfox.package({
  name: "sourcehutIntegration",
  title: "Sourcehut Integration",
  supportedPlatforms: ["all"],
  menu: [
    {
      group: "Help",
      label: "Sourcehut",
      items: [
        {
          label: "Source Code on SourceHut",
          event: "url:open",
          data: "https://git.sr.ht/~soapdog/patchfox/"
        }
      ]
    }
  ]
})
