patchfox.package({
  name: "sourcehutIntegration",
  supportedPlatforms: ["nodejs-ssb"],
  menu: [
    {
      group: "Help",
      label: "Sourcehut",
      items: [
        {
          label: "Source Code",
          event: "url:open",
          data: "https://git.sr.ht/~soapdog/patchfox/"
        }
      ]
    }
  ]
});
