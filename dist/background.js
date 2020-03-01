(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

const {updateChecker} =  require("./updateChecker");
const {initializeContextMenus} = require("./contextMenus.js")
const {initializeOmniboxFeatures} = require("./search.js")

console.log("starting background script")
initializeContextMenus();
initializeOmniboxFeatures();
updateChecker();
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
        let query = encodeURIComponent(text);
        let url = `/index.html?query=${query}&pkg=search`;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS9iYWNrZ3JvdW5kL2JhY2tncm91bmQuanMiLCJzcmMvY29yZS9iYWNrZ3JvdW5kL2NvbnRleHRNZW51cy5qcyIsInNyYy9jb3JlL2JhY2tncm91bmQvc2VhcmNoLmpzIiwic3JjL2NvcmUvYmFja2dyb3VuZC91cGRhdGVDaGVja2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcclxuY29uc3Qge3VwZGF0ZUNoZWNrZXJ9ID0gIHJlcXVpcmUoXCIuL3VwZGF0ZUNoZWNrZXJcIik7XHJcbmNvbnN0IHtpbml0aWFsaXplQ29udGV4dE1lbnVzfSA9IHJlcXVpcmUoXCIuL2NvbnRleHRNZW51cy5qc1wiKVxyXG5jb25zdCB7aW5pdGlhbGl6ZU9tbmlib3hGZWF0dXJlc30gPSByZXF1aXJlKFwiLi9zZWFyY2guanNcIilcclxuXHJcbmNvbnNvbGUubG9nKFwic3RhcnRpbmcgYmFja2dyb3VuZCBzY3JpcHRcIilcclxuaW5pdGlhbGl6ZUNvbnRleHRNZW51cygpO1xyXG5pbml0aWFsaXplT21uaWJveEZlYXR1cmVzKCk7XHJcbnVwZGF0ZUNoZWNrZXIoKTsiLCJmdW5jdGlvbiBvbkNyZWF0ZWQoKSB7XHJcbiAgICBpZiAoYnJvd3Nlci5ydW50aW1lLmxhc3RFcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBFcnJvcjogJHticm93c2VyLnJ1bnRpbWUubGFzdEVycm9yfWApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkNvbnRleHQgbWVudSBpdGVtIGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5XCIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjb3B5VG9DbGlwYm9hcmQodGV4dCwgaHRtbCkge1xyXG4gICAgZnVuY3Rpb24gb25jb3B5KGV2ZW50KSB7XHJcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvcHlcIiwgb25jb3B5LCB0cnVlKTtcclxuICAgICAgICAvLyBIaWRlIHRoZSBldmVudCBmcm9tIHRoZSBwYWdlIHRvIHByZXZlbnQgdGFtcGVyaW5nLlxyXG4gICAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgICAvLyBPdmVyd3JpdGUgdGhlIGNsaXBib2FyZCBjb250ZW50LlxyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgZXZlbnQuY2xpcGJvYXJkRGF0YS5zZXREYXRhKFwidGV4dC9wbGFpblwiLCB0ZXh0KTtcclxuICAgICAgICBldmVudC5jbGlwYm9hcmREYXRhLnNldERhdGEoXCJ0ZXh0L2h0bWxcIiwgaHRtbCk7XHJcbiAgICB9XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY29weVwiLCBvbmNvcHksIHRydWUpO1xyXG5cclxuICAgIC8vIFJlcXVpcmVzIHRoZSBjbGlwYm9hcmRXcml0ZSBwZXJtaXNzaW9uLCBvciBhIHVzZXIgZ2VzdHVyZTpcclxuICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKFwiY29weVwiKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaW5pdGlhbGl6ZUNvbnRleHRNZW51cygpIHtcclxuICAgIGJyb3dzZXIuY29udGV4dE1lbnVzLmNyZWF0ZSh7XHJcbiAgICAgICAgaWQ6IFwidGV4dC1zZWxlY3Rpb24tdG8tY2xpcGJvYXJkLWFzLXF1b3RhdGlvblwiLFxyXG4gICAgICAgIHRpdGxlOiBcIkNvcHkgc2VsZWN0ZWQgdGV4dCBhcyBxdW90YXRpb25cIixcclxuICAgICAgICBjb250ZXh0czogW1wic2VsZWN0aW9uXCJdXHJcbiAgICB9LCBvbkNyZWF0ZWQpO1xyXG5cclxuICAgIGJyb3dzZXIuY29udGV4dE1lbnVzLmNyZWF0ZSh7XHJcbiAgICAgICAgaWQ6IFwicGFnZS1hY3Rpb24tdG8tY2xpcGJvYXJkLWFzLWxpbmtcIixcclxuICAgICAgICB0aXRsZTogXCJDb3B5IGxpbmsgdG8gdGhlIGN1cnJlbnQgcGFnZVwiLFxyXG4gICAgICAgIGNvbnRleHRzOiBbXCJhbGxcIiwgXCJwYWdlX2FjdGlvblwiXVxyXG4gICAgfSwgb25DcmVhdGVkKTtcclxuXHJcbiAgICBicm93c2VyLmNvbnRleHRNZW51cy5jcmVhdGUoe1xyXG4gICAgICAgIGlkOiBcImxpbmstdG8tY2xpcGJvYXJkLWFzLWxpbmtcIixcclxuICAgICAgICB0aXRsZTogXCJDb3B5IGxpbmtcIixcclxuICAgICAgICBjb250ZXh0czogW1wibGlua1wiXVxyXG4gICAgfSwgb25DcmVhdGVkKTtcclxuXHJcbiAgICBicm93c2VyLmNvbnRleHRNZW51cy5vbkNsaWNrZWQuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKGluZm8sIHRhYikge1xyXG4gICAgICAgIGxldCB0ZW1wbGF0ZVxyXG4gICAgICAgIGNvbnNvbGUuZGlyKFwiaW5mb1wiLCBpbmZvKVxyXG4gICAgICAgIHN3aXRjaCAoaW5mby5tZW51SXRlbUlkKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ0ZXh0LXNlbGVjdGlvbi10by1jbGlwYm9hcmQtYXMtcXVvdGF0aW9uXCI6XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9IGA+ICR7aW5mby5zZWxlY3Rpb25UZXh0fVxcbiZtZGFzaDsgX1NvdXJjZTogWyR7dGFiLnRpdGxlfV0oJHtpbmZvLnBhZ2VVcmx9KV9gXHJcbiAgICAgICAgICAgICAgICBjb3B5VG9DbGlwYm9hcmQodGVtcGxhdGUsIHRlbXBsYXRlKVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJwYWdlLWFjdGlvbi10by1jbGlwYm9hcmQtYXMtbGlua1wiOlxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGUgPSBgWyR7dGFiLnRpdGxlfV0oJHt0YWIudXJsfSlgXHJcbiAgICAgICAgICAgICAgICBjb3B5VG9DbGlwYm9hcmQodGVtcGxhdGUsIHRlbXBsYXRlKVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJsaW5rLXRvLWNsaXBib2FyZC1hcy1saW5rXCI6XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9IGBbJHtpbmZvLmxpbmtUZXh0fV0oJHtpbmZvLmxpbmtVcmx9KWBcclxuICAgICAgICAgICAgICAgIGNvcHlUb0NsaXBib2FyZCh0ZW1wbGF0ZSwgdGVtcGxhdGUpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGluaXRpYWxpemVDb250ZXh0TWVudXNcclxufSIsImNvbnN0IGluaXRpYWxpemVPbW5pYm94RmVhdHVyZXMgPSAoKSA9PiB7XHJcbiAgICBicm93c2VyLm9tbmlib3guc2V0RGVmYXVsdFN1Z2dlc3Rpb24oe1xyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBgU2VhcmNoIFNlY3VyZSBTY3V0dGxlYnV0dGBcclxuICAgIH0pO1xyXG5cclxuICAgIGJyb3dzZXIub21uaWJveC5vbklucHV0RW50ZXJlZC5hZGRMaXN0ZW5lcigodGV4dCwgZGlzcG9zaXRpb24pID0+IHtcclxuICAgICAgICBsZXQgcXVlcnkgPSBlbmNvZGVVUklDb21wb25lbnQodGV4dCk7XHJcbiAgICAgICAgbGV0IHVybCA9IGAvaW5kZXguaHRtbD9xdWVyeT0ke3F1ZXJ5fSZwa2c9c2VhcmNoYDtcclxuXHJcbiAgICAgICAgc3dpdGNoIChkaXNwb3NpdGlvbikge1xyXG4gICAgICAgICAgICBjYXNlIFwiY3VycmVudFRhYlwiOlxyXG4gICAgICAgICAgICAgICAgYnJvd3Nlci50YWJzLnVwZGF0ZSh7IHVybCB9KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibmV3Rm9yZWdyb3VuZFRhYlwiOlxyXG4gICAgICAgICAgICAgICAgYnJvd3Nlci50YWJzLmNyZWF0ZSh7IHVybCB9KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibmV3QmFja2dyb3VuZFRhYlwiOlxyXG4gICAgICAgICAgICAgICAgYnJvd3Nlci50YWJzLmNyZWF0ZSh7IHVybCwgYWN0aXZlOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGluaXRpYWxpemVPbW5pYm94RmVhdHVyZXNcclxufSIsImNvbnN0IHVwZGF0ZUNoZWNrZXIgPSAoKSA9PiB7XHJcbiAgICBmdW5jdGlvbiBpbnN0YWxsZWRPclVwZGF0ZWQoZGV0YWlscykge1xyXG4gICAgICAgIGxldCB1cmw7XHJcbiAgICAgICAgbGV0IHZlcnNpb24gPSBicm93c2VyLnJ1bnRpbWUuZ2V0TWFuaWZlc3QoKS52ZXJzaW9uO1xyXG4gICAgICAgIGxldCBwcmV2aW91c1ZlcnNpb24gPSBkZXRhaWxzLnByZXZpb3VzVmVyc2lvbjtcclxuICAgICAgICBzd2l0Y2ggKGRldGFpbHMucmVhc29uKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ1cGRhdGVcIjpcclxuICAgICAgICAgICAgICAgIGlmICh2ZXJzaW9uICE9PSBwcmV2aW91c1ZlcnNpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICB1cmwgPSBicm93c2VyLmV4dGVuc2lvbi5nZXRVUkwoYC9kb2NzL2luZGV4Lmh0bWwjL3JlbGVhc2Vfbm90ZXMvJHt2ZXJzaW9ufWApO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyb3dzZXIudGFicy5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGAke3VybH1gXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImluc3RhbGxcIjpcclxuICAgICAgICAgICAgICAgIHVybCA9IGJyb3dzZXIuZXh0ZW5zaW9uLmdldFVSTChcIi9kb2NzL2luZGV4Lmh0bWwjL2d1aWRlXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJvd3Nlci50YWJzLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBgJHt1cmx9YFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYnJvd3Nlci5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKGluc3RhbGxlZE9yVXBkYXRlZClcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICB1cGRhdGVDaGVja2VyXHJcbn1cclxuIl19
