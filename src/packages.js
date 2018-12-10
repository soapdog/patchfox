import m from "mithril";
import AppShell from "./app-shell/shell"

/* Need to add packages manually because there is no support Dynamic Imports */
import Setup from "./packages/setup"
import ErrorHandler from "./packages/errorHelper"
import FeedViewer from "./packages/feedViewer"
import ScuttleShellHandler from "./packages/scuttleShellHandler"

var packagesToLoad = [
  Setup,
  FeedViewer,
  ScuttleShellHandler,
  ErrorHandler // <-- must be last one
]

// TODO: fix package loading, it is ugly
// I wanted to make this more dynamic but unfortunatelly
// Firefox does not support dynamic imports yet,
// so I had to hack. 
var packages = {
  load: async () => {
    // blocking loop below is to make sure oninit runs before
    // mithril attempts to mount any route.
    for (var i = 0; i < packagesToLoad.length; i++) {
      let p = packagesToLoad[i]
      if (p.hasOwnProperty("oninit")) {
        await p.oninit()
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
            render: () => m(AppShell, m(route.view))
          };
        });
      }
    });
    return routes;
  },
  loadedPackages: () => {
    return packagesToLoad.map(pkg => {
      return {
        name: pkg.name,
        description: pkg.description,
        routes: pkg.routes.map(r => r.route)
      };
    })
  }

};

export default packages;