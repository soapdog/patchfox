import m from "./web_modules/mithril.js"
import css from "./web_modules/csz.js"
import BrowserFS from "./web_modules/browserfs.js"
import { packages } from "./packages/packages.js"

BrowserFS.install(window);

BrowserFS.configure({
  fs: "MountableFileSystem",
  options: {
    "/tmp": { fs: "InMemory" },
    "/home": { fs: "IndexedDB", options: { storeName: "home" } },
    "/workspaces": { fs: "IndexedDB", options: { storeName: "workspaces" } }
  }
}, function (e) {
  if (e) {
    // An error occurred.
    throw e;
  }
  // Otherwise, BrowserFS is ready to use!
  window.fs = BrowserFS.BFSRequire('fs');
  window.path = BrowserFS.BFSRequire('path');
});

BrowserFS.initialize()


let systemPackages = Object.entries(packages)
  .filter(([_key, pkg]) => {
    let configurationForPackage = pkg.configuration()
    return configurationForPackage.system || false
  })
  .map(([_key, pkg]) => pkg)

class Root {
  view() {
    return m("div.root", systemPackages.map(p => m(p)))
  }
}

m.mount(document.body, Root)
