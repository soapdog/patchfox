browser.omnibox.setDefaultSuggestion({
    description: "Open Patchfox"
});

browser.omnibox.onInputEntered.addListener((text, disposition) => {
    const url =  browser.extension.getURL("index.html") + "#public";
    
    switch (disposition) {
    case "currentTab":
        browser.tabs.update({ url });
        break;
    case "newForegroundTab":
        browser.tabs.create({ url });
        break;
    case "newBackgroundTab":
        browser.tabs.create({ url, active: false });
        break;
    }
});
