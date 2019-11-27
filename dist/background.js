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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS9iYWNrZ3JvdW5kL2JhY2tncm91bmQuanMiLCJzcmMvY29yZS9iYWNrZ3JvdW5kL2NvbnRleHRNZW51cy5qcyIsInNyYy9jb3JlL2JhY2tncm91bmQvc2VhcmNoLmpzIiwic3JjL2NvcmUvYmFja2dyb3VuZC91cGRhdGVDaGVja2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcclxuY29uc3Qge3VwZGF0ZUNoZWNrZXJ9ID0gIHJlcXVpcmUoXCIuL3VwZGF0ZUNoZWNrZXJcIik7XHJcbmNvbnN0IHtpbml0aWFsaXplQ29udGV4dE1lbnVzfSA9IHJlcXVpcmUoXCIuL2NvbnRleHRNZW51cy5qc1wiKVxyXG5jb25zdCB7aW5pdGlhbGl6ZU9tbmlib3hGZWF0dXJlc30gPSByZXF1aXJlKFwiLi9zZWFyY2guanNcIilcclxuXHJcbmNvbnNvbGUubG9nKFwic3RhcnRpbmcgYmFja2dyb3VuZCBzY3JpcHRcIilcclxuaW5pdGlhbGl6ZUNvbnRleHRNZW51cygpO1xyXG5pbml0aWFsaXplT21uaWJveEZlYXR1cmVzKCk7XHJcbnVwZGF0ZUNoZWNrZXIoKTtcclxuXHJcbi8vIENhY2hlIGNvbnRhY3RzXHJcbiIsImZ1bmN0aW9uIG9uQ3JlYXRlZCgpIHtcclxuICAgIGlmIChicm93c2VyLnJ1bnRpbWUubGFzdEVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYEVycm9yOiAke2Jyb3dzZXIucnVudGltZS5sYXN0RXJyb3J9YCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ29udGV4dCBtZW51IGl0ZW0gY3JlYXRlZCBzdWNjZXNzZnVsbHlcIik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvcHlUb0NsaXBib2FyZCh0ZXh0LCBodG1sKSB7XHJcbiAgICBmdW5jdGlvbiBvbmNvcHkoZXZlbnQpIHtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29weVwiLCBvbmNvcHksIHRydWUpO1xyXG4gICAgICAgIC8vIEhpZGUgdGhlIGV2ZW50IGZyb20gdGhlIHBhZ2UgdG8gcHJldmVudCB0YW1wZXJpbmcuXHJcbiAgICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAgIC8vIE92ZXJ3cml0ZSB0aGUgY2xpcGJvYXJkIGNvbnRlbnQuXHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBldmVudC5jbGlwYm9hcmREYXRhLnNldERhdGEoXCJ0ZXh0L3BsYWluXCIsIHRleHQpO1xyXG4gICAgICAgIGV2ZW50LmNsaXBib2FyZERhdGEuc2V0RGF0YShcInRleHQvaHRtbFwiLCBodG1sKTtcclxuICAgIH1cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjb3B5XCIsIG9uY29weSwgdHJ1ZSk7XHJcblxyXG4gICAgLy8gUmVxdWlyZXMgdGhlIGNsaXBib2FyZFdyaXRlIHBlcm1pc3Npb24sIG9yIGEgdXNlciBnZXN0dXJlOlxyXG4gICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoXCJjb3B5XCIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbml0aWFsaXplQ29udGV4dE1lbnVzKCkge1xyXG4gICAgYnJvd3Nlci5jb250ZXh0TWVudXMuY3JlYXRlKHtcclxuICAgICAgICBpZDogXCJ0ZXh0LXNlbGVjdGlvbi10by1jbGlwYm9hcmQtYXMtcXVvdGF0aW9uXCIsXHJcbiAgICAgICAgdGl0bGU6IFwiQ29weSBzZWxlY3RlZCB0ZXh0IGFzIHF1b3RhdGlvblwiLFxyXG4gICAgICAgIGNvbnRleHRzOiBbXCJzZWxlY3Rpb25cIl1cclxuICAgIH0sIG9uQ3JlYXRlZCk7XHJcblxyXG4gICAgYnJvd3Nlci5jb250ZXh0TWVudXMuY3JlYXRlKHtcclxuICAgICAgICBpZDogXCJwYWdlLWFjdGlvbi10by1jbGlwYm9hcmQtYXMtbGlua1wiLFxyXG4gICAgICAgIHRpdGxlOiBcIkNvcHkgbGluayB0byB0aGUgY3VycmVudCBwYWdlXCIsXHJcbiAgICAgICAgY29udGV4dHM6IFtcImFsbFwiLCBcInBhZ2VfYWN0aW9uXCJdXHJcbiAgICB9LCBvbkNyZWF0ZWQpO1xyXG5cclxuICAgIGJyb3dzZXIuY29udGV4dE1lbnVzLmNyZWF0ZSh7XHJcbiAgICAgICAgaWQ6IFwibGluay10by1jbGlwYm9hcmQtYXMtbGlua1wiLFxyXG4gICAgICAgIHRpdGxlOiBcIkNvcHkgbGlua1wiLFxyXG4gICAgICAgIGNvbnRleHRzOiBbXCJsaW5rXCJdXHJcbiAgICB9LCBvbkNyZWF0ZWQpO1xyXG5cclxuICAgIGJyb3dzZXIuY29udGV4dE1lbnVzLm9uQ2xpY2tlZC5hZGRMaXN0ZW5lcihmdW5jdGlvbiAoaW5mbywgdGFiKSB7XHJcbiAgICAgICAgbGV0IHRlbXBsYXRlXHJcbiAgICAgICAgY29uc29sZS5kaXIoXCJpbmZvXCIsIGluZm8pXHJcbiAgICAgICAgc3dpdGNoIChpbmZvLm1lbnVJdGVtSWQpIHtcclxuICAgICAgICAgICAgY2FzZSBcInRleHQtc2VsZWN0aW9uLXRvLWNsaXBib2FyZC1hcy1xdW90YXRpb25cIjpcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gYD4gJHtpbmZvLnNlbGVjdGlvblRleHR9XFxuJm1kYXNoOyBfU291cmNlOiBbJHt0YWIudGl0bGV9XSgke2luZm8ucGFnZVVybH0pX2BcclxuICAgICAgICAgICAgICAgIGNvcHlUb0NsaXBib2FyZCh0ZW1wbGF0ZSwgdGVtcGxhdGUpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInBhZ2UtYWN0aW9uLXRvLWNsaXBib2FyZC1hcy1saW5rXCI6XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9IGBbJHt0YWIudGl0bGV9XSgke3RhYi51cmx9KWBcclxuICAgICAgICAgICAgICAgIGNvcHlUb0NsaXBib2FyZCh0ZW1wbGF0ZSwgdGVtcGxhdGUpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImxpbmstdG8tY2xpcGJvYXJkLWFzLWxpbmtcIjpcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gYFske2luZm8ubGlua1RleHR9XSgke2luZm8ubGlua1VybH0pYFxyXG4gICAgICAgICAgICAgICAgY29weVRvQ2xpcGJvYXJkKHRlbXBsYXRlLCB0ZW1wbGF0ZSlcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgaW5pdGlhbGl6ZUNvbnRleHRNZW51c1xyXG59IiwiY29uc3QgaW5pdGlhbGl6ZU9tbmlib3hGZWF0dXJlcyA9ICgpID0+IHtcclxuICAgIGJyb3dzZXIub21uaWJveC5zZXREZWZhdWx0U3VnZ2VzdGlvbih7XHJcbiAgICAgICAgZGVzY3JpcHRpb246IGBTZWFyY2ggU2VjdXJlIFNjdXR0bGVidXR0YFxyXG4gICAgfSk7XHJcblxyXG4gICAgYnJvd3Nlci5vbW5pYm94Lm9uSW5wdXRFbnRlcmVkLmFkZExpc3RlbmVyKCh0ZXh0LCBkaXNwb3NpdGlvbikgPT4ge1xyXG4gICAgICAgIGxldCBxdWVyeSA9IGVuY29kZVVSSUNvbXBvbmVudCh0ZXh0KTtcclxuICAgICAgICBsZXQgdXJsID0gYC9pbmRleC5odG1sP3F1ZXJ5PSR7cXVlcnl9JnBrZz1zZWFyY2hgO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGRpc3Bvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJjdXJyZW50VGFiXCI6XHJcbiAgICAgICAgICAgICAgICBicm93c2VyLnRhYnMudXBkYXRlKHsgdXJsIH0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJuZXdGb3JlZ3JvdW5kVGFiXCI6XHJcbiAgICAgICAgICAgICAgICBicm93c2VyLnRhYnMuY3JlYXRlKHsgdXJsIH0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJuZXdCYWNrZ3JvdW5kVGFiXCI6XHJcbiAgICAgICAgICAgICAgICBicm93c2VyLnRhYnMuY3JlYXRlKHsgdXJsLCBhY3RpdmU6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgaW5pdGlhbGl6ZU9tbmlib3hGZWF0dXJlc1xyXG59IiwiY29uc3QgdXBkYXRlQ2hlY2tlciA9ICgpID0+IHtcclxuICAgIGZ1bmN0aW9uIGluc3RhbGxlZE9yVXBkYXRlZChkZXRhaWxzKSB7XHJcbiAgICAgICAgbGV0IHVybDtcclxuICAgICAgICBsZXQgdmVyc2lvbiA9IGJyb3dzZXIucnVudGltZS5nZXRNYW5pZmVzdCgpLnZlcnNpb247XHJcbiAgICAgICAgbGV0IHByZXZpb3VzVmVyc2lvbiA9IGRldGFpbHMucHJldmlvdXNWZXJzaW9uO1xyXG4gICAgICAgIHN3aXRjaCAoZGV0YWlscy5yZWFzb24pIHtcclxuICAgICAgICAgICAgY2FzZSBcInVwZGF0ZVwiOlxyXG4gICAgICAgICAgICAgICAgaWYgKHZlcnNpb24gIT09IHByZXZpb3VzVmVyc2lvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHVybCA9IGJyb3dzZXIuZXh0ZW5zaW9uLmdldFVSTChgL2RvY3MvaW5kZXguaHRtbCMvcmVsZWFzZV9ub3Rlcy8ke3ZlcnNpb259YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJvd3Nlci50YWJzLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogYCR7dXJsfWBcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiaW5zdGFsbFwiOlxyXG4gICAgICAgICAgICAgICAgdXJsID0gYnJvd3Nlci5leHRlbnNpb24uZ2V0VVJMKFwiL2RvY3MvaW5kZXguaHRtbCMvZ3VpZGVcIik7XHJcbiAgICAgICAgICAgICAgICBicm93c2VyLnRhYnMuY3JlYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IGAke3VybH1gXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBicm93c2VyLnJ1bnRpbWUub25JbnN0YWxsZWQuYWRkTGlzdGVuZXIoaW5zdGFsbGVkT3JVcGRhdGVkKVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHVwZGF0ZUNoZWNrZXJcclxufVxyXG4iXX0=
