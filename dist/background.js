(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

const {updateChecker} =  require("./updateChecker");
const {initializeContextMenus} = require("./contextMenus.js")
const {initializeOmniboxFeatures} = require("./search.js")

console.log("starting background script")
initializeContextMenus();
initializeOmniboxFeatures();
updateChecker();

// Cache contacts

},{"./contextMenus.js":2,"./search.js":3,"./updateChecker":4}],2:[function(require,module,exports){
function onCreated() {
    if (browser.runtime.lastError) {
        console.log(`Error: ${browser.runtime.lastError}`);
    } else {
        console.log("Context menu item created successfully");
    }
}

function copyToClipboard(text, html) {
    function oncopy(event) {
        document.removeEventListener("copy", oncopy, true);
        // Hide the event from the page to prevent tampering.
        event.stopImmediatePropagation();

        // Overwrite the clipboard content.
        event.preventDefault();
        event.clipboardData.setData("text/plain", text);
        event.clipboardData.setData("text/html", html);
    }
    document.addEventListener("copy", oncopy, true);

    // Requires the clipboardWrite permission, or a user gesture:
    document.execCommand("copy");
}

function initializeContextMenus() {
    browser.contextMenus.create({
        id: "text-selection-to-clipboard-as-quotation",
        title: "Copy selected text as quotation",
        contexts: ["selection"]
    }, onCreated);

    browser.contextMenus.create({
        id: "page-action-to-clipboard-as-link",
        title: "Copy link to the current page",
        contexts: ["all", "page_action"]
    }, onCreated);

    browser.contextMenus.create({
        id: "link-to-clipboard-as-link",
        title: "Copy link",
        contexts: ["link"]
    }, onCreated);

    browser.contextMenus.onClicked.addListener(function (info, tab) {
        let template
        console.dir("info", info)
        switch (info.menuItemId) {
            case "text-selection-to-clipboard-as-quotation":
                template = `> ${info.selectionText}\n&mdash; _Source: [${tab.title}](${info.pageUrl})_`
                copyToClipboard(template, template)
                break;
            case "page-action-to-clipboard-as-link":
                template = `[${tab.title}](${tab.url})`
                copyToClipboard(template, template)
                break;
            case "link-to-clipboard-as-link":
                template = `[${info.linkText}](${info.linkUrl})`
                copyToClipboard(template, template)
                break;
        }
    })
}

module.exports = {
    initializeContextMenus
}
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS9iYWNrZ3JvdW5kL2JhY2tncm91bmQuanMiLCJzcmMvY29yZS9iYWNrZ3JvdW5kL2NvbnRleHRNZW51cy5qcyIsInNyYy9jb3JlL2JhY2tncm91bmQvc2VhcmNoLmpzIiwic3JjL2NvcmUvYmFja2dyb3VuZC91cGRhdGVDaGVja2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXHJcbmNvbnN0IHt1cGRhdGVDaGVja2VyfSA9ICByZXF1aXJlKFwiLi91cGRhdGVDaGVja2VyXCIpO1xyXG5jb25zdCB7aW5pdGlhbGl6ZUNvbnRleHRNZW51c30gPSByZXF1aXJlKFwiLi9jb250ZXh0TWVudXMuanNcIilcclxuY29uc3Qge2luaXRpYWxpemVPbW5pYm94RmVhdHVyZXN9ID0gcmVxdWlyZShcIi4vc2VhcmNoLmpzXCIpXHJcblxyXG5jb25zb2xlLmxvZyhcInN0YXJ0aW5nIGJhY2tncm91bmQgc2NyaXB0XCIpXHJcbmluaXRpYWxpemVDb250ZXh0TWVudXMoKTtcclxuaW5pdGlhbGl6ZU9tbmlib3hGZWF0dXJlcygpO1xyXG51cGRhdGVDaGVja2VyKCk7XHJcblxyXG4vLyBDYWNoZSBjb250YWN0c1xyXG4iLCJmdW5jdGlvbiBvbkNyZWF0ZWQoKSB7XHJcbiAgICBpZiAoYnJvd3Nlci5ydW50aW1lLmxhc3RFcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBFcnJvcjogJHticm93c2VyLnJ1bnRpbWUubGFzdEVycm9yfWApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkNvbnRleHQgbWVudSBpdGVtIGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5XCIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjb3B5VG9DbGlwYm9hcmQodGV4dCwgaHRtbCkge1xyXG4gICAgZnVuY3Rpb24gb25jb3B5KGV2ZW50KSB7XHJcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvcHlcIiwgb25jb3B5LCB0cnVlKTtcclxuICAgICAgICAvLyBIaWRlIHRoZSBldmVudCBmcm9tIHRoZSBwYWdlIHRvIHByZXZlbnQgdGFtcGVyaW5nLlxyXG4gICAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgICAvLyBPdmVyd3JpdGUgdGhlIGNsaXBib2FyZCBjb250ZW50LlxyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgZXZlbnQuY2xpcGJvYXJkRGF0YS5zZXREYXRhKFwidGV4dC9wbGFpblwiLCB0ZXh0KTtcclxuICAgICAgICBldmVudC5jbGlwYm9hcmREYXRhLnNldERhdGEoXCJ0ZXh0L2h0bWxcIiwgaHRtbCk7XHJcbiAgICB9XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY29weVwiLCBvbmNvcHksIHRydWUpO1xyXG5cclxuICAgIC8vIFJlcXVpcmVzIHRoZSBjbGlwYm9hcmRXcml0ZSBwZXJtaXNzaW9uLCBvciBhIHVzZXIgZ2VzdHVyZTpcclxuICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKFwiY29weVwiKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaW5pdGlhbGl6ZUNvbnRleHRNZW51cygpIHtcclxuICAgIGJyb3dzZXIuY29udGV4dE1lbnVzLmNyZWF0ZSh7XHJcbiAgICAgICAgaWQ6IFwidGV4dC1zZWxlY3Rpb24tdG8tY2xpcGJvYXJkLWFzLXF1b3RhdGlvblwiLFxyXG4gICAgICAgIHRpdGxlOiBcIkNvcHkgc2VsZWN0ZWQgdGV4dCBhcyBxdW90YXRpb25cIixcclxuICAgICAgICBjb250ZXh0czogW1wic2VsZWN0aW9uXCJdXHJcbiAgICB9LCBvbkNyZWF0ZWQpO1xyXG5cclxuICAgIGJyb3dzZXIuY29udGV4dE1lbnVzLmNyZWF0ZSh7XHJcbiAgICAgICAgaWQ6IFwicGFnZS1hY3Rpb24tdG8tY2xpcGJvYXJkLWFzLWxpbmtcIixcclxuICAgICAgICB0aXRsZTogXCJDb3B5IGxpbmsgdG8gdGhlIGN1cnJlbnQgcGFnZVwiLFxyXG4gICAgICAgIGNvbnRleHRzOiBbXCJhbGxcIiwgXCJwYWdlX2FjdGlvblwiXVxyXG4gICAgfSwgb25DcmVhdGVkKTtcclxuXHJcbiAgICBicm93c2VyLmNvbnRleHRNZW51cy5jcmVhdGUoe1xyXG4gICAgICAgIGlkOiBcImxpbmstdG8tY2xpcGJvYXJkLWFzLWxpbmtcIixcclxuICAgICAgICB0aXRsZTogXCJDb3B5IGxpbmtcIixcclxuICAgICAgICBjb250ZXh0czogW1wibGlua1wiXVxyXG4gICAgfSwgb25DcmVhdGVkKTtcclxuXHJcbiAgICBicm93c2VyLmNvbnRleHRNZW51cy5vbkNsaWNrZWQuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKGluZm8sIHRhYikge1xyXG4gICAgICAgIGxldCB0ZW1wbGF0ZVxyXG4gICAgICAgIGNvbnNvbGUuZGlyKFwiaW5mb1wiLCBpbmZvKVxyXG4gICAgICAgIHN3aXRjaCAoaW5mby5tZW51SXRlbUlkKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ0ZXh0LXNlbGVjdGlvbi10by1jbGlwYm9hcmQtYXMtcXVvdGF0aW9uXCI6XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9IGA+ICR7aW5mby5zZWxlY3Rpb25UZXh0fVxcbiZtZGFzaDsgX1NvdXJjZTogWyR7dGFiLnRpdGxlfV0oJHtpbmZvLnBhZ2VVcmx9KV9gXHJcbiAgICAgICAgICAgICAgICBjb3B5VG9DbGlwYm9hcmQodGVtcGxhdGUsIHRlbXBsYXRlKVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJwYWdlLWFjdGlvbi10by1jbGlwYm9hcmQtYXMtbGlua1wiOlxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGUgPSBgWyR7dGFiLnRpdGxlfV0oJHt0YWIudXJsfSlgXHJcbiAgICAgICAgICAgICAgICBjb3B5VG9DbGlwYm9hcmQodGVtcGxhdGUsIHRlbXBsYXRlKVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJsaW5rLXRvLWNsaXBib2FyZC1hcy1saW5rXCI6XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9IGBbJHtpbmZvLmxpbmtUZXh0fV0oJHtpbmZvLmxpbmtVcmx9KWBcclxuICAgICAgICAgICAgICAgIGNvcHlUb0NsaXBib2FyZCh0ZW1wbGF0ZSwgdGVtcGxhdGUpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGluaXRpYWxpemVDb250ZXh0TWVudXNcclxufSIsImNvbnN0IGluaXRpYWxpemVPbW5pYm94RmVhdHVyZXMgPSAoKSA9PiB7XHJcbiAgICBicm93c2VyLm9tbmlib3guc2V0RGVmYXVsdFN1Z2dlc3Rpb24oe1xyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBgU2VhcmNoIFNlY3VyZSBTY3V0dGxlYnV0dGBcclxuICAgIH0pO1xyXG5cclxuICAgIGJyb3dzZXIub21uaWJveC5vbklucHV0RW50ZXJlZC5hZGRMaXN0ZW5lcigodGV4dCwgZGlzcG9zaXRpb24pID0+IHtcclxuICAgICAgICBsZXQgdXJsID0gYC9pbmRleC5odG1sP3F1ZXJ5PSR7dGV4dH0jL3NlYXJjaGA7XHJcblxyXG4gICAgICAgIHN3aXRjaCAoZGlzcG9zaXRpb24pIHtcclxuICAgICAgICAgICAgY2FzZSBcImN1cnJlbnRUYWJcIjpcclxuICAgICAgICAgICAgICAgIGJyb3dzZXIudGFicy51cGRhdGUoeyB1cmwgfSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIm5ld0ZvcmVncm91bmRUYWJcIjpcclxuICAgICAgICAgICAgICAgIGJyb3dzZXIudGFicy5jcmVhdGUoeyB1cmwgfSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIm5ld0JhY2tncm91bmRUYWJcIjpcclxuICAgICAgICAgICAgICAgIGJyb3dzZXIudGFicy5jcmVhdGUoeyB1cmwsIGFjdGl2ZTogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBpbml0aWFsaXplT21uaWJveEZlYXR1cmVzXHJcbn0iLCJjb25zdCB1cGRhdGVDaGVja2VyID0gKCkgPT4ge1xyXG4gICAgZnVuY3Rpb24gaW5zdGFsbGVkT3JVcGRhdGVkKGRldGFpbHMpIHtcclxuICAgICAgICBsZXQgdXJsO1xyXG4gICAgICAgIGxldCB2ZXJzaW9uID0gYnJvd3Nlci5ydW50aW1lLmdldE1hbmlmZXN0KCkudmVyc2lvbjtcclxuICAgICAgICBsZXQgcHJldmlvdXNWZXJzaW9uID0gZGV0YWlscy5wcmV2aW91c1ZlcnNpb247XHJcbiAgICAgICAgc3dpdGNoIChkZXRhaWxzLnJlYXNvbikge1xyXG4gICAgICAgICAgICBjYXNlIFwidXBkYXRlXCI6XHJcbiAgICAgICAgICAgICAgICBpZiAodmVyc2lvbiAhPT0gcHJldmlvdXNWZXJzaW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gYnJvd3Nlci5leHRlbnNpb24uZ2V0VVJMKGAvZG9jcy9pbmRleC5odG1sIy9yZWxlYXNlX25vdGVzLyR7dmVyc2lvbn1gKTtcclxuICAgICAgICAgICAgICAgICAgICBicm93c2VyLnRhYnMuY3JlYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBgJHt1cmx9YFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpbnN0YWxsXCI6XHJcbiAgICAgICAgICAgICAgICB1cmwgPSBicm93c2VyLmV4dGVuc2lvbi5nZXRVUkwoXCIvZG9jcy9pbmRleC5odG1sIy9ndWlkZVwiKTtcclxuICAgICAgICAgICAgICAgIGJyb3dzZXIudGFicy5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogYCR7dXJsfWBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGJyb3dzZXIucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcihpbnN0YWxsZWRPclVwZGF0ZWQpXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgdXBkYXRlQ2hlY2tlclxyXG59XHJcbiJdfQ==
