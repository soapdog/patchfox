patchfox.package({
  name: "KoFiIntegration",
  title: "Ko-Fi Integration",
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
