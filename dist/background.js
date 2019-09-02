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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS9iYWNrZ3JvdW5kL2JhY2tncm91bmQuanMiLCJzcmMvY29yZS9iYWNrZ3JvdW5kL2NvbnRleHRNZW51cy5qcyIsInNyYy9jb3JlL2JhY2tncm91bmQvc2VhcmNoLmpzIiwic3JjL2NvcmUvYmFja2dyb3VuZC91cGRhdGVDaGVja2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXG5jb25zdCB7dXBkYXRlQ2hlY2tlcn0gPSAgcmVxdWlyZShcIi4vdXBkYXRlQ2hlY2tlclwiKTtcbmNvbnN0IHtpbml0aWFsaXplQ29udGV4dE1lbnVzfSA9IHJlcXVpcmUoXCIuL2NvbnRleHRNZW51cy5qc1wiKVxuY29uc3Qge2luaXRpYWxpemVPbW5pYm94RmVhdHVyZXN9ID0gcmVxdWlyZShcIi4vc2VhcmNoLmpzXCIpXG5cbmNvbnNvbGUubG9nKFwic3RhcnRpbmcgYmFja2dyb3VuZCBzY3JpcHRcIilcbmluaXRpYWxpemVDb250ZXh0TWVudXMoKTtcbmluaXRpYWxpemVPbW5pYm94RmVhdHVyZXMoKTtcbnVwZGF0ZUNoZWNrZXIoKTtcblxuLy8gQ2FjaGUgY29udGFjdHNcbiIsImZ1bmN0aW9uIG9uQ3JlYXRlZCgpIHtcbiAgICBpZiAoYnJvd3Nlci5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3I6ICR7YnJvd3Nlci5ydW50aW1lLmxhc3RFcnJvcn1gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkNvbnRleHQgbWVudSBpdGVtIGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5XCIpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY29weVRvQ2xpcGJvYXJkKHRleHQsIGh0bWwpIHtcbiAgICBmdW5jdGlvbiBvbmNvcHkoZXZlbnQpIHtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvcHlcIiwgb25jb3B5LCB0cnVlKTtcbiAgICAgICAgLy8gSGlkZSB0aGUgZXZlbnQgZnJvbSB0aGUgcGFnZSB0byBwcmV2ZW50IHRhbXBlcmluZy5cbiAgICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgLy8gT3ZlcndyaXRlIHRoZSBjbGlwYm9hcmQgY29udGVudC5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuY2xpcGJvYXJkRGF0YS5zZXREYXRhKFwidGV4dC9wbGFpblwiLCB0ZXh0KTtcbiAgICAgICAgZXZlbnQuY2xpcGJvYXJkRGF0YS5zZXREYXRhKFwidGV4dC9odG1sXCIsIGh0bWwpO1xuICAgIH1cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY29weVwiLCBvbmNvcHksIHRydWUpO1xuXG4gICAgLy8gUmVxdWlyZXMgdGhlIGNsaXBib2FyZFdyaXRlIHBlcm1pc3Npb24sIG9yIGEgdXNlciBnZXN0dXJlOlxuICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKFwiY29weVwiKTtcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZUNvbnRleHRNZW51cygpIHtcbiAgICBicm93c2VyLmNvbnRleHRNZW51cy5jcmVhdGUoe1xuICAgICAgICBpZDogXCJ0ZXh0LXNlbGVjdGlvbi10by1jbGlwYm9hcmQtYXMtcXVvdGF0aW9uXCIsXG4gICAgICAgIHRpdGxlOiBcIkNvcHkgc2VsZWN0ZWQgdGV4dCBhcyBxdW90YXRpb25cIixcbiAgICAgICAgY29udGV4dHM6IFtcInNlbGVjdGlvblwiXVxuICAgIH0sIG9uQ3JlYXRlZCk7XG5cbiAgICBicm93c2VyLmNvbnRleHRNZW51cy5jcmVhdGUoe1xuICAgICAgICBpZDogXCJwYWdlLWFjdGlvbi10by1jbGlwYm9hcmQtYXMtbGlua1wiLFxuICAgICAgICB0aXRsZTogXCJDb3B5IGxpbmsgdG8gdGhlIGN1cnJlbnQgcGFnZVwiLFxuICAgICAgICBjb250ZXh0czogW1wiYWxsXCIsIFwicGFnZV9hY3Rpb25cIl1cbiAgICB9LCBvbkNyZWF0ZWQpO1xuXG4gICAgYnJvd3Nlci5jb250ZXh0TWVudXMuY3JlYXRlKHtcbiAgICAgICAgaWQ6IFwibGluay10by1jbGlwYm9hcmQtYXMtbGlua1wiLFxuICAgICAgICB0aXRsZTogXCJDb3B5IGxpbmtcIixcbiAgICAgICAgY29udGV4dHM6IFtcImxpbmtcIl1cbiAgICB9LCBvbkNyZWF0ZWQpO1xuXG4gICAgYnJvd3Nlci5jb250ZXh0TWVudXMub25DbGlja2VkLmFkZExpc3RlbmVyKGZ1bmN0aW9uIChpbmZvLCB0YWIpIHtcbiAgICAgICAgbGV0IHRlbXBsYXRlXG4gICAgICAgIGNvbnNvbGUuZGlyKFwiaW5mb1wiLCBpbmZvKVxuICAgICAgICBzd2l0Y2ggKGluZm8ubWVudUl0ZW1JZCkge1xuICAgICAgICAgICAgY2FzZSBcInRleHQtc2VsZWN0aW9uLXRvLWNsaXBib2FyZC1hcy1xdW90YXRpb25cIjpcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9IGA+ICR7aW5mby5zZWxlY3Rpb25UZXh0fVxcbiZtZGFzaDsgX1NvdXJjZTogWyR7dGFiLnRpdGxlfV0oJHtpbmZvLnBhZ2VVcmx9KV9gXG4gICAgICAgICAgICAgICAgY29weVRvQ2xpcGJvYXJkKHRlbXBsYXRlLCB0ZW1wbGF0ZSlcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJwYWdlLWFjdGlvbi10by1jbGlwYm9hcmQtYXMtbGlua1wiOlxuICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gYFske3RhYi50aXRsZX1dKCR7dGFiLnVybH0pYFxuICAgICAgICAgICAgICAgIGNvcHlUb0NsaXBib2FyZCh0ZW1wbGF0ZSwgdGVtcGxhdGUpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibGluay10by1jbGlwYm9hcmQtYXMtbGlua1wiOlxuICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gYFske2luZm8ubGlua1RleHR9XSgke2luZm8ubGlua1VybH0pYFxuICAgICAgICAgICAgICAgIGNvcHlUb0NsaXBib2FyZCh0ZW1wbGF0ZSwgdGVtcGxhdGUpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9KVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBpbml0aWFsaXplQ29udGV4dE1lbnVzXG59IiwiY29uc3QgaW5pdGlhbGl6ZU9tbmlib3hGZWF0dXJlcyA9ICgpID0+IHtcbiAgICBicm93c2VyLm9tbmlib3guc2V0RGVmYXVsdFN1Z2dlc3Rpb24oe1xuICAgICAgICBkZXNjcmlwdGlvbjogYFNlYXJjaCBTZWN1cmUgU2N1dHRsZWJ1dHRgXG4gICAgfSk7XG5cbiAgICBicm93c2VyLm9tbmlib3gub25JbnB1dEVudGVyZWQuYWRkTGlzdGVuZXIoKHRleHQsIGRpc3Bvc2l0aW9uKSA9PiB7XG4gICAgICAgIGxldCB1cmwgPSBgL2luZGV4Lmh0bWw/cXVlcnk9JHt0ZXh0fSMvc2VhcmNoYDtcblxuICAgICAgICBzd2l0Y2ggKGRpc3Bvc2l0aW9uKSB7XG4gICAgICAgICAgICBjYXNlIFwiY3VycmVudFRhYlwiOlxuICAgICAgICAgICAgICAgIGJyb3dzZXIudGFicy51cGRhdGUoeyB1cmwgfSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibmV3Rm9yZWdyb3VuZFRhYlwiOlxuICAgICAgICAgICAgICAgIGJyb3dzZXIudGFicy5jcmVhdGUoeyB1cmwgfSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibmV3QmFja2dyb3VuZFRhYlwiOlxuICAgICAgICAgICAgICAgIGJyb3dzZXIudGFicy5jcmVhdGUoeyB1cmwsIGFjdGl2ZTogZmFsc2UgfSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaW5pdGlhbGl6ZU9tbmlib3hGZWF0dXJlc1xufSIsImNvbnN0IHVwZGF0ZUNoZWNrZXIgPSAoKSA9PiB7XG4gICAgZnVuY3Rpb24gaW5zdGFsbGVkT3JVcGRhdGVkKGRldGFpbHMpIHtcbiAgICAgICAgbGV0IHVybDtcbiAgICAgICAgbGV0IHZlcnNpb24gPSBicm93c2VyLnJ1bnRpbWUuZ2V0TWFuaWZlc3QoKS52ZXJzaW9uO1xuICAgICAgICBsZXQgcHJldmlvdXNWZXJzaW9uID0gZGV0YWlscy5wcmV2aW91c1ZlcnNpb247XG4gICAgICAgIHN3aXRjaCAoZGV0YWlscy5yZWFzb24pIHtcbiAgICAgICAgICAgIGNhc2UgXCJ1cGRhdGVcIjpcbiAgICAgICAgICAgICAgICBpZiAodmVyc2lvbiAhPT0gcHJldmlvdXNWZXJzaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHVybCA9IGJyb3dzZXIuZXh0ZW5zaW9uLmdldFVSTChgL2RvY3MvaW5kZXguaHRtbCMvcmVsZWFzZV9ub3Rlcy8ke3ZlcnNpb259YCk7XG4gICAgICAgICAgICAgICAgICAgIGJyb3dzZXIudGFicy5jcmVhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBgJHt1cmx9YFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiaW5zdGFsbFwiOlxuICAgICAgICAgICAgICAgIHVybCA9IGJyb3dzZXIuZXh0ZW5zaW9uLmdldFVSTChcIi9kb2NzL2luZGV4Lmh0bWwjL2d1aWRlXCIpO1xuICAgICAgICAgICAgICAgIGJyb3dzZXIudGFicy5jcmVhdGUoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IGAke3VybH1gXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBicm93c2VyLnJ1bnRpbWUub25JbnN0YWxsZWQuYWRkTGlzdGVuZXIoaW5zdGFsbGVkT3JVcGRhdGVkKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICB1cGRhdGVDaGVja2VyXG59XG4iXX0=
