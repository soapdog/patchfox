const initializeOmniboxFeatures = () => {
    browser.omnibox.setDefaultSuggestion({
        description: `Search Secure Scuttlebutt`
    });

    browser.omnibox.onInputEntered.addListener((text, disposition) => {
        let url = `/index.html?query=${text}#/search`;

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
}

module.exports = {
    initializeOmniboxFeatures
}