patchfox.package({
  name: "KoFiIntegration",
  supportedPlatforms: ["all"],
  menu: [
    {
      group: "Help",
      items: [
        {
          label: "Buy Me a Coffee",
          event: "url:open",
          data: "https://ko-fi.com/andreshouldbewriting"
        }
      ]
    }
  ]
})
