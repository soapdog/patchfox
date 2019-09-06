patchfox.package({
  name: "githubIntegration",
  menu: [
    {
      group: "Help",
      items: [
        {
          label: "GitHub Issues",
          event: "url:open",
          data: "https://github.com/soapdog/patchfox/issues"
        }
      ]
    }
  ]
});
