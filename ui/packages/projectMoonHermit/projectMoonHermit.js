const ProjectMoonHermit = require("./ProjectMoonHermit.svelte")

patchfox.package({
  name: "projectMoonHermit",
  title: "Project Moon Hermit",
  supportedPlatforms: ["nodejs-db1"],
  app: true,
  icon: "crescent-moon.png",
  view: ProjectMoonHermit,
})
