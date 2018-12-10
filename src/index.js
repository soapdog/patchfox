import m from "mithril";

import "./sass/main.scss";

import Packages from "./packages";



var main = async () => {
  console.log("Loading packages...");
  var packages = await Packages.load();
  var routes = Packages.routes();
  Packages.loadedPackages().forEach(pkg => {
    console.log(`Package: ${pkg.name}\n\t${pkg.description}\n\tRoutes:\n\t${pkg.routes}\n`);
  })

  m.route.prefix('#')
  m.route(document.body, "/setup", routes)
}

main()