(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
browser.omnibox.setDefaultSuggestion({
    description: "Open Patchfox"
});

browser.omnibox.onInputEntered.addListener(function (text, disposition) {
    var url = browser.extension.getURL("index.html") + "#public";

    switch (disposition) {
        case "currentTab":
            browser.tabs.update({ url: url });
            break;
        case "newForegroundTab":
            browser.tabs.create({ url: url });
            break;
        case "newBackgroundTab":
            browser.tabs.create({ url: url, active: false });
            break;
    }
});

},{}]},{},[1])

//# sourceMappingURL=debug/background.js.map
