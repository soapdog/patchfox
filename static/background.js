/**
 * The background script knows if we have saved configuration or not
 * If it finds the configuration, it can start a connection to sbot on its own.
 */
let configuration = false;

const configurationPresent = (savedData) => {
    configuration = savedData;
    window.ssb = {
        config: savedData
    };
};
const configurationMissing = () => configuration => false;

browser.storage.local.get().then(configurationPresent, configurationMissing);

/**
 * The browser action is the toolbar item with the hermie
 * it is defines in static/manifest.json
 */
const browserActionHandler = () => {
    browser.tabs.create({
        url: browser.extension.getURL("index.html")
    });
};


browser.browserAction.onClicked.addListener(browserActionHandler);