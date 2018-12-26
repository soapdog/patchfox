import m from "mithril";
import Packages from "./packages";
import "./sass/main.scss";
import ref from "ssb-ref";

// The code below is to handle custom protocol (ssb:)
if (location.hash.indexOf("#/intercept/") !== -1) {
  // fix problem with IDs containing slashes
  let decoded_id = decodeURIComponent(location.hash.replace("#/intercept/ssb%3A", ""));
  let encoded_id = encodeURIComponent(decoded_id);

  console.log(decoded_id)
  if (ref.isBlob(decoded_id)) {
    window.location = `http://localhost:8989/blobs/get/${encoded_id}`;
  } else if (ref.isLink(decoded_id) || ref.isMsg(decoded_id)) {
    location.hash = `#/thread/${encoded_id}`;
  } else if (ref.isFeed(decoded_id)) {
    location.hash = `#/profile/${encoded_id}`;
  } else if (decoded_id[0] === "#") {
    location.hash = `#/channel/${encoded_id}`;
  } else if (decoded_id[0] === "%") {
    location.hash = `#/thread/${encoded_id}`;
  } else {
    console.log("didn't match anything.")
  }

}


const main = async () => {
  console.log("Loading packages...");
  const packages = await Packages.load();
  const routes = Packages.routes();
  Packages.loadedPackages().forEach(pkg => {
    console.log(`Package: ${pkg.name}\n\t${pkg.description}\n\tRoutes:\n\t${pkg.routes}\n`);
  });

  let defaultRoute = "/setup";
  if (window.sbot) {
    defaultRoute = "/public";
  }

  m.route.prefix('#');
  m.route(document.body, defaultRoute, routes);
}

main();