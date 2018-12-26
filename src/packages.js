import m from "mithril";
import AppShell from "./app-shell/shell";

/* Need to add packages manually because there is no support Dynamic Imports */
import Common from "./common";
import Setup from "./setup";
import ErrorHandler from "./errorHelper";
import FeedViewer from "./feedViewer";

const packagesToLoad = [
  Common,
  Setup,
  FeedViewer,
  ErrorHandler // <-- must be last one
];

// TODO: fix package loading, it is ugly
// I wanted to make this more dynamic but unfortunatelly
// Firefox does not support dynamic imports yet,
// so I had to hack. 
const packages = {
  load: async () => {
    // blocking loop below is to make sure oninit runs before
    // mithril attempts to mount any route.
    for (var i = 0; i < packagesToLoad.length; i++) {
      let p = packagesToLoad[i];
      if (p.hasOwnProperty("oninit")) {
        await p.oninit();
      }
    }
    return packagesToLoad;
  },
  routes: () => {
    var routes = {};
    packagesToLoad.forEach(pkg => {
      if (pkg.hasOwnProperty("routes")) {
        pkg.routes.forEach(route => {
          routes[route.route] = {
            render: (vnode) => m(AppShell, m(route.view))
          };
        });
      }
    });
    return routes;
  },
  loadedPackages: () => {
    return packagesToLoad.map(pkg => {
      if (pkg.hasOwnProperty("routes")) {
        return {
          name: pkg.name,
          description: pkg.description,
          routes: pkg.routes.map(r => r.route)
        };
      } else {
        return {
          name: pkg.name,
          description: pkg.description
        };
      }
    })
  }

};

export default packages;