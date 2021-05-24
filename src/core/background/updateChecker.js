const browser = require("webextension-polyfill");

const updateChecker = () => {
  function installedOrUpdated(details) {
    let url;
    let version = browser.runtime.getManifest().version;
    let previousVersion = details.previousVersion;
    switch (details.reason) {
      case "update":
      if (version !== previousVersion) {
        url = browser.extension.getURL(`/docs/index.html#/release_notes/${version}`);
        browser.tabs.create({
          url: `${url}`
        });
      }
      break;
      case "install":
      url = browser.extension.getURL("/docs/index.html#/guide");
      browser.tabs.create({
        url: `${url}`
      });
      break;
    }
  }

  browser.runtime.onInstalled.addListener(installedOrUpdated)
}

module.exports = {
  updateChecker
}
