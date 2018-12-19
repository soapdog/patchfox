import m from "mithril";
import Packages from "./packages";
import "./sass/main.scss";

// The code below is to handle custom protocol (ssb:)
if (location.hash.indexOf("#/thread/") !== -1) {
  // fix problem with IDs containing slashes
  let id = location.hash
  if (id.indexOf("ssb%3A") !== -1) {
    id = id.replace("ssb%3A", "")
  }
  id = encodeURIComponent(decodeURIComponent(id.slice(9)))

  location.hash = `#/thread/${id}`
}


const main = async () => {
  console.log("Loading packages...");
  const packages = await Packages.load();
  const routes = Packages.routes();
  Packages.loadedPackages().forEach(pkg => {
    console.log(`Package: ${pkg.name}\n\t${pkg.description}\n\tRoutes:\n\t${pkg.routes}\n`);
  });

  m.route.prefix('#');
  m.route(document.body, "/setup", routes);
}

main();