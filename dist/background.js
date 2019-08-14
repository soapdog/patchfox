(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

const {updateChecker} =  require("./updateChecker");
const {initializeContextMenus} = require("./contextMenus.js")

console.log("starting background script")
initializeContextMenus();
updateChecker();

// Cache contacts

},{"./contextMenus.js":2,"./updateChecker":3}],2:[function(require,module,exports){
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
        title: "Copy link to this page",
        contexts: ["all","page_action"]
    }, onCreated);

    browser.contextMenus.onClicked.addListener(function (info, tab) {
        let template
        switch (info.menuItemId) {
            case "text-selection-to-clipboard-as-quotation":
                template = `> ${info.selectionText}\n&mdash; _Source: [${tab.title}](${info.pageUrl})_`
                copyToClipboard(template, template)
                break;
            case "page-action-to-clipboard-as-link":
                template = `[${tab.title}](${tab.url})`
                copyToClipboard(template, template)
                break;
        }
    })
}

module.exports = {
    initializeContextMenus
}
},{}],3:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYmFja2dyb3VuZC9iYWNrZ3JvdW5kLmpzIiwic3JjL2JhY2tncm91bmQvY29udGV4dE1lbnVzLmpzIiwic3JjL2JhY2tncm91bmQvdXBkYXRlQ2hlY2tlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlxyXG5jb25zdCB7dXBkYXRlQ2hlY2tlcn0gPSAgcmVxdWlyZShcIi4vdXBkYXRlQ2hlY2tlclwiKTtcclxuY29uc3Qge2luaXRpYWxpemVDb250ZXh0TWVudXN9ID0gcmVxdWlyZShcIi4vY29udGV4dE1lbnVzLmpzXCIpXHJcblxyXG5jb25zb2xlLmxvZyhcInN0YXJ0aW5nIGJhY2tncm91bmQgc2NyaXB0XCIpXHJcbmluaXRpYWxpemVDb250ZXh0TWVudXMoKTtcclxudXBkYXRlQ2hlY2tlcigpO1xyXG5cclxuLy8gQ2FjaGUgY29udGFjdHNcclxuIiwiZnVuY3Rpb24gb25DcmVhdGVkKCkge1xyXG4gICAgaWYgKGJyb3dzZXIucnVudGltZS5sYXN0RXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3I6ICR7YnJvd3Nlci5ydW50aW1lLmxhc3RFcnJvcn1gKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJDb250ZXh0IG1lbnUgaXRlbSBjcmVhdGVkIHN1Y2Nlc3NmdWxseVwiKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY29weVRvQ2xpcGJvYXJkKHRleHQsIGh0bWwpIHtcclxuICAgIGZ1bmN0aW9uIG9uY29weShldmVudCkge1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb3B5XCIsIG9uY29weSwgdHJ1ZSk7XHJcbiAgICAgICAgLy8gSGlkZSB0aGUgZXZlbnQgZnJvbSB0aGUgcGFnZSB0byBwcmV2ZW50IHRhbXBlcmluZy5cclxuICAgICAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgICAgLy8gT3ZlcndyaXRlIHRoZSBjbGlwYm9hcmQgY29udGVudC5cclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGV2ZW50LmNsaXBib2FyZERhdGEuc2V0RGF0YShcInRleHQvcGxhaW5cIiwgdGV4dCk7XHJcbiAgICAgICAgZXZlbnQuY2xpcGJvYXJkRGF0YS5zZXREYXRhKFwidGV4dC9odG1sXCIsIGh0bWwpO1xyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvcHlcIiwgb25jb3B5LCB0cnVlKTtcclxuXHJcbiAgICAvLyBSZXF1aXJlcyB0aGUgY2xpcGJvYXJkV3JpdGUgcGVybWlzc2lvbiwgb3IgYSB1c2VyIGdlc3R1cmU6XHJcbiAgICBkb2N1bWVudC5leGVjQ29tbWFuZChcImNvcHlcIik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXRpYWxpemVDb250ZXh0TWVudXMoKSB7XHJcbiAgICBicm93c2VyLmNvbnRleHRNZW51cy5jcmVhdGUoe1xyXG4gICAgICAgIGlkOiBcInRleHQtc2VsZWN0aW9uLXRvLWNsaXBib2FyZC1hcy1xdW90YXRpb25cIixcclxuICAgICAgICB0aXRsZTogXCJDb3B5IHNlbGVjdGVkIHRleHQgYXMgcXVvdGF0aW9uXCIsXHJcbiAgICAgICAgY29udGV4dHM6IFtcInNlbGVjdGlvblwiXVxyXG4gICAgfSwgb25DcmVhdGVkKTtcclxuXHJcbiAgICBicm93c2VyLmNvbnRleHRNZW51cy5jcmVhdGUoe1xyXG4gICAgICAgIGlkOiBcInBhZ2UtYWN0aW9uLXRvLWNsaXBib2FyZC1hcy1saW5rXCIsXHJcbiAgICAgICAgdGl0bGU6IFwiQ29weSBsaW5rIHRvIHRoaXMgcGFnZVwiLFxyXG4gICAgICAgIGNvbnRleHRzOiBbXCJhbGxcIixcInBhZ2VfYWN0aW9uXCJdXHJcbiAgICB9LCBvbkNyZWF0ZWQpO1xyXG5cclxuICAgIGJyb3dzZXIuY29udGV4dE1lbnVzLm9uQ2xpY2tlZC5hZGRMaXN0ZW5lcihmdW5jdGlvbiAoaW5mbywgdGFiKSB7XHJcbiAgICAgICAgbGV0IHRlbXBsYXRlXHJcbiAgICAgICAgc3dpdGNoIChpbmZvLm1lbnVJdGVtSWQpIHtcclxuICAgICAgICAgICAgY2FzZSBcInRleHQtc2VsZWN0aW9uLXRvLWNsaXBib2FyZC1hcy1xdW90YXRpb25cIjpcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gYD4gJHtpbmZvLnNlbGVjdGlvblRleHR9XFxuJm1kYXNoOyBfU291cmNlOiBbJHt0YWIudGl0bGV9XSgke2luZm8ucGFnZVVybH0pX2BcclxuICAgICAgICAgICAgICAgIGNvcHlUb0NsaXBib2FyZCh0ZW1wbGF0ZSwgdGVtcGxhdGUpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInBhZ2UtYWN0aW9uLXRvLWNsaXBib2FyZC1hcy1saW5rXCI6XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9IGBbJHt0YWIudGl0bGV9XSgke3RhYi51cmx9KWBcclxuICAgICAgICAgICAgICAgIGNvcHlUb0NsaXBib2FyZCh0ZW1wbGF0ZSwgdGVtcGxhdGUpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGluaXRpYWxpemVDb250ZXh0TWVudXNcclxufSIsImNvbnN0IHVwZGF0ZUNoZWNrZXIgPSAoKSA9PiB7XHJcbiAgICBmdW5jdGlvbiBpbnN0YWxsZWRPclVwZGF0ZWQoZGV0YWlscykge1xyXG4gICAgICAgIGxldCB1cmw7XHJcbiAgICAgICAgbGV0IHZlcnNpb24gPSBicm93c2VyLnJ1bnRpbWUuZ2V0TWFuaWZlc3QoKS52ZXJzaW9uO1xyXG4gICAgICAgIGxldCBwcmV2aW91c1ZlcnNpb24gPSBkZXRhaWxzLnByZXZpb3VzVmVyc2lvbjtcclxuICAgICAgICBzd2l0Y2ggKGRldGFpbHMucmVhc29uKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ1cGRhdGVcIjpcclxuICAgICAgICAgICAgICAgIGlmICh2ZXJzaW9uICE9PSBwcmV2aW91c1ZlcnNpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICB1cmwgPSBicm93c2VyLmV4dGVuc2lvbi5nZXRVUkwoYC9kb2NzL2luZGV4Lmh0bWwjL3JlbGVhc2Vfbm90ZXMvJHt2ZXJzaW9ufWApO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyb3dzZXIudGFicy5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGAke3VybH1gXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImluc3RhbGxcIjpcclxuICAgICAgICAgICAgICAgIHVybCA9IGJyb3dzZXIuZXh0ZW5zaW9uLmdldFVSTChcIi9kb2NzL2luZGV4Lmh0bWwjL2d1aWRlXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJvd3Nlci50YWJzLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBgJHt1cmx9YFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYnJvd3Nlci5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKGluc3RhbGxlZE9yVXBkYXRlZClcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICB1cGRhdGVDaGVja2VyXHJcbn1cclxuIl19
