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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYmFja2dyb3VuZC9iYWNrZ3JvdW5kLmpzIiwic3JjL2JhY2tncm91bmQvY29udGV4dE1lbnVzLmpzIiwic3JjL2JhY2tncm91bmQvc2VhcmNoLmpzIiwic3JjL2JhY2tncm91bmQvdXBkYXRlQ2hlY2tlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlxyXG5jb25zdCB7dXBkYXRlQ2hlY2tlcn0gPSAgcmVxdWlyZShcIi4vdXBkYXRlQ2hlY2tlclwiKTtcclxuY29uc3Qge2luaXRpYWxpemVDb250ZXh0TWVudXN9ID0gcmVxdWlyZShcIi4vY29udGV4dE1lbnVzLmpzXCIpXHJcbmNvbnN0IHtpbml0aWFsaXplT21uaWJveEZlYXR1cmVzfSA9IHJlcXVpcmUoXCIuL3NlYXJjaC5qc1wiKVxyXG5cclxuY29uc29sZS5sb2coXCJzdGFydGluZyBiYWNrZ3JvdW5kIHNjcmlwdFwiKVxyXG5pbml0aWFsaXplQ29udGV4dE1lbnVzKCk7XHJcbmluaXRpYWxpemVPbW5pYm94RmVhdHVyZXMoKTtcclxudXBkYXRlQ2hlY2tlcigpO1xyXG5cclxuLy8gQ2FjaGUgY29udGFjdHNcclxuIiwiZnVuY3Rpb24gb25DcmVhdGVkKCkge1xyXG4gICAgaWYgKGJyb3dzZXIucnVudGltZS5sYXN0RXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3I6ICR7YnJvd3Nlci5ydW50aW1lLmxhc3RFcnJvcn1gKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJDb250ZXh0IG1lbnUgaXRlbSBjcmVhdGVkIHN1Y2Nlc3NmdWxseVwiKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY29weVRvQ2xpcGJvYXJkKHRleHQsIGh0bWwpIHtcclxuICAgIGZ1bmN0aW9uIG9uY29weShldmVudCkge1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb3B5XCIsIG9uY29weSwgdHJ1ZSk7XHJcbiAgICAgICAgLy8gSGlkZSB0aGUgZXZlbnQgZnJvbSB0aGUgcGFnZSB0byBwcmV2ZW50IHRhbXBlcmluZy5cclxuICAgICAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgICAgLy8gT3ZlcndyaXRlIHRoZSBjbGlwYm9hcmQgY29udGVudC5cclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGV2ZW50LmNsaXBib2FyZERhdGEuc2V0RGF0YShcInRleHQvcGxhaW5cIiwgdGV4dCk7XHJcbiAgICAgICAgZXZlbnQuY2xpcGJvYXJkRGF0YS5zZXREYXRhKFwidGV4dC9odG1sXCIsIGh0bWwpO1xyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvcHlcIiwgb25jb3B5LCB0cnVlKTtcclxuXHJcbiAgICAvLyBSZXF1aXJlcyB0aGUgY2xpcGJvYXJkV3JpdGUgcGVybWlzc2lvbiwgb3IgYSB1c2VyIGdlc3R1cmU6XHJcbiAgICBkb2N1bWVudC5leGVjQ29tbWFuZChcImNvcHlcIik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXRpYWxpemVDb250ZXh0TWVudXMoKSB7XHJcbiAgICBicm93c2VyLmNvbnRleHRNZW51cy5jcmVhdGUoe1xyXG4gICAgICAgIGlkOiBcInRleHQtc2VsZWN0aW9uLXRvLWNsaXBib2FyZC1hcy1xdW90YXRpb25cIixcclxuICAgICAgICB0aXRsZTogXCJDb3B5IHNlbGVjdGVkIHRleHQgYXMgcXVvdGF0aW9uXCIsXHJcbiAgICAgICAgY29udGV4dHM6IFtcInNlbGVjdGlvblwiXVxyXG4gICAgfSwgb25DcmVhdGVkKTtcclxuXHJcbiAgICBicm93c2VyLmNvbnRleHRNZW51cy5jcmVhdGUoe1xyXG4gICAgICAgIGlkOiBcInBhZ2UtYWN0aW9uLXRvLWNsaXBib2FyZC1hcy1saW5rXCIsXHJcbiAgICAgICAgdGl0bGU6IFwiQ29weSBsaW5rIHRvIHRoZSBjdXJyZW50IHBhZ2VcIixcclxuICAgICAgICBjb250ZXh0czogW1wiYWxsXCIsIFwicGFnZV9hY3Rpb25cIl1cclxuICAgIH0sIG9uQ3JlYXRlZCk7XHJcblxyXG4gICAgYnJvd3Nlci5jb250ZXh0TWVudXMuY3JlYXRlKHtcclxuICAgICAgICBpZDogXCJsaW5rLXRvLWNsaXBib2FyZC1hcy1saW5rXCIsXHJcbiAgICAgICAgdGl0bGU6IFwiQ29weSBsaW5rXCIsXHJcbiAgICAgICAgY29udGV4dHM6IFtcImxpbmtcIl1cclxuICAgIH0sIG9uQ3JlYXRlZCk7XHJcblxyXG4gICAgYnJvd3Nlci5jb250ZXh0TWVudXMub25DbGlja2VkLmFkZExpc3RlbmVyKGZ1bmN0aW9uIChpbmZvLCB0YWIpIHtcclxuICAgICAgICBsZXQgdGVtcGxhdGVcclxuICAgICAgICBjb25zb2xlLmRpcihcImluZm9cIiwgaW5mbylcclxuICAgICAgICBzd2l0Y2ggKGluZm8ubWVudUl0ZW1JZCkge1xyXG4gICAgICAgICAgICBjYXNlIFwidGV4dC1zZWxlY3Rpb24tdG8tY2xpcGJvYXJkLWFzLXF1b3RhdGlvblwiOlxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGUgPSBgPiAke2luZm8uc2VsZWN0aW9uVGV4dH1cXG4mbWRhc2g7IF9Tb3VyY2U6IFske3RhYi50aXRsZX1dKCR7aW5mby5wYWdlVXJsfSlfYFxyXG4gICAgICAgICAgICAgICAgY29weVRvQ2xpcGJvYXJkKHRlbXBsYXRlLCB0ZW1wbGF0ZSlcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwicGFnZS1hY3Rpb24tdG8tY2xpcGJvYXJkLWFzLWxpbmtcIjpcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gYFske3RhYi50aXRsZX1dKCR7dGFiLnVybH0pYFxyXG4gICAgICAgICAgICAgICAgY29weVRvQ2xpcGJvYXJkKHRlbXBsYXRlLCB0ZW1wbGF0ZSlcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibGluay10by1jbGlwYm9hcmQtYXMtbGlua1wiOlxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGUgPSBgWyR7aW5mby5saW5rVGV4dH1dKCR7aW5mby5saW5rVXJsfSlgXHJcbiAgICAgICAgICAgICAgICBjb3B5VG9DbGlwYm9hcmQodGVtcGxhdGUsIHRlbXBsYXRlKVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBpbml0aWFsaXplQ29udGV4dE1lbnVzXHJcbn0iLCJjb25zdCBpbml0aWFsaXplT21uaWJveEZlYXR1cmVzID0gKCkgPT4ge1xyXG4gICAgYnJvd3Nlci5vbW5pYm94LnNldERlZmF1bHRTdWdnZXN0aW9uKHtcclxuICAgICAgICBkZXNjcmlwdGlvbjogYFNlYXJjaCBTZWN1cmUgU2N1dHRsZWJ1dHRgXHJcbiAgICB9KTtcclxuXHJcbiAgICBicm93c2VyLm9tbmlib3gub25JbnB1dEVudGVyZWQuYWRkTGlzdGVuZXIoKHRleHQsIGRpc3Bvc2l0aW9uKSA9PiB7XHJcbiAgICAgICAgbGV0IHVybCA9IGAvaW5kZXguaHRtbD9xdWVyeT0ke3RleHR9Iy9zZWFyY2hgO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGRpc3Bvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJjdXJyZW50VGFiXCI6XHJcbiAgICAgICAgICAgICAgICBicm93c2VyLnRhYnMudXBkYXRlKHsgdXJsIH0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJuZXdGb3JlZ3JvdW5kVGFiXCI6XHJcbiAgICAgICAgICAgICAgICBicm93c2VyLnRhYnMuY3JlYXRlKHsgdXJsIH0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJuZXdCYWNrZ3JvdW5kVGFiXCI6XHJcbiAgICAgICAgICAgICAgICBicm93c2VyLnRhYnMuY3JlYXRlKHsgdXJsLCBhY3RpdmU6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgaW5pdGlhbGl6ZU9tbmlib3hGZWF0dXJlc1xyXG59IiwiY29uc3QgdXBkYXRlQ2hlY2tlciA9ICgpID0+IHtcclxuICAgIGZ1bmN0aW9uIGluc3RhbGxlZE9yVXBkYXRlZChkZXRhaWxzKSB7XHJcbiAgICAgICAgbGV0IHVybDtcclxuICAgICAgICBsZXQgdmVyc2lvbiA9IGJyb3dzZXIucnVudGltZS5nZXRNYW5pZmVzdCgpLnZlcnNpb247XHJcbiAgICAgICAgbGV0IHByZXZpb3VzVmVyc2lvbiA9IGRldGFpbHMucHJldmlvdXNWZXJzaW9uO1xyXG4gICAgICAgIHN3aXRjaCAoZGV0YWlscy5yZWFzb24pIHtcclxuICAgICAgICAgICAgY2FzZSBcInVwZGF0ZVwiOlxyXG4gICAgICAgICAgICAgICAgaWYgKHZlcnNpb24gIT09IHByZXZpb3VzVmVyc2lvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHVybCA9IGJyb3dzZXIuZXh0ZW5zaW9uLmdldFVSTChgL2RvY3MvaW5kZXguaHRtbCMvcmVsZWFzZV9ub3Rlcy8ke3ZlcnNpb259YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJvd3Nlci50YWJzLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogYCR7dXJsfWBcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiaW5zdGFsbFwiOlxyXG4gICAgICAgICAgICAgICAgdXJsID0gYnJvd3Nlci5leHRlbnNpb24uZ2V0VVJMKFwiL2RvY3MvaW5kZXguaHRtbCMvZ3VpZGVcIik7XHJcbiAgICAgICAgICAgICAgICBicm93c2VyLnRhYnMuY3JlYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IGAke3VybH1gXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBicm93c2VyLnJ1bnRpbWUub25JbnN0YWxsZWQuYWRkTGlzdGVuZXIoaW5zdGFsbGVkT3JVcGRhdGVkKVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHVwZGF0ZUNoZWNrZXJcclxufVxyXG4iXX0=
