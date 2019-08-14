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
        title: "Copy Selected Text as Quotation",
        contexts: ["selection"]
    }, onCreated);

    browser.contextMenus.onClicked.addListener(function (info, tab) {
        switch (info.menuItemId) {
            case "text-selection-to-clipboard-as-quotation":
                console.log(info.selectionText);
                console.log(info)

                let title = tab.title

                let template = `> ${info.selectionText}\n&mdash; _Source: [${title}](${info.pageUrl})_`
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYmFja2dyb3VuZC9iYWNrZ3JvdW5kLmpzIiwic3JjL2JhY2tncm91bmQvY29udGV4dE1lbnVzLmpzIiwic3JjL2JhY2tncm91bmQvdXBkYXRlQ2hlY2tlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlxyXG5jb25zdCB7dXBkYXRlQ2hlY2tlcn0gPSAgcmVxdWlyZShcIi4vdXBkYXRlQ2hlY2tlclwiKTtcclxuY29uc3Qge2luaXRpYWxpemVDb250ZXh0TWVudXN9ID0gcmVxdWlyZShcIi4vY29udGV4dE1lbnVzLmpzXCIpXHJcblxyXG5jb25zb2xlLmxvZyhcInN0YXJ0aW5nIGJhY2tncm91bmQgc2NyaXB0XCIpXHJcbmluaXRpYWxpemVDb250ZXh0TWVudXMoKTtcclxudXBkYXRlQ2hlY2tlcigpO1xyXG5cclxuLy8gQ2FjaGUgY29udGFjdHNcclxuIiwiZnVuY3Rpb24gb25DcmVhdGVkKCkge1xyXG4gICAgaWYgKGJyb3dzZXIucnVudGltZS5sYXN0RXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3I6ICR7YnJvd3Nlci5ydW50aW1lLmxhc3RFcnJvcn1gKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJDb250ZXh0IG1lbnUgaXRlbSBjcmVhdGVkIHN1Y2Nlc3NmdWxseVwiKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY29weVRvQ2xpcGJvYXJkKHRleHQsIGh0bWwpIHtcclxuICAgIGZ1bmN0aW9uIG9uY29weShldmVudCkge1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb3B5XCIsIG9uY29weSwgdHJ1ZSk7XHJcbiAgICAgICAgLy8gSGlkZSB0aGUgZXZlbnQgZnJvbSB0aGUgcGFnZSB0byBwcmV2ZW50IHRhbXBlcmluZy5cclxuICAgICAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgICAgLy8gT3ZlcndyaXRlIHRoZSBjbGlwYm9hcmQgY29udGVudC5cclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGV2ZW50LmNsaXBib2FyZERhdGEuc2V0RGF0YShcInRleHQvcGxhaW5cIiwgdGV4dCk7XHJcbiAgICAgICAgZXZlbnQuY2xpcGJvYXJkRGF0YS5zZXREYXRhKFwidGV4dC9odG1sXCIsIGh0bWwpO1xyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvcHlcIiwgb25jb3B5LCB0cnVlKTtcclxuXHJcbiAgICAvLyBSZXF1aXJlcyB0aGUgY2xpcGJvYXJkV3JpdGUgcGVybWlzc2lvbiwgb3IgYSB1c2VyIGdlc3R1cmU6XHJcbiAgICBkb2N1bWVudC5leGVjQ29tbWFuZChcImNvcHlcIik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXRpYWxpemVDb250ZXh0TWVudXMoKSB7XHJcbiAgICBicm93c2VyLmNvbnRleHRNZW51cy5jcmVhdGUoe1xyXG4gICAgICAgIGlkOiBcInRleHQtc2VsZWN0aW9uLXRvLWNsaXBib2FyZC1hcy1xdW90YXRpb25cIixcclxuICAgICAgICB0aXRsZTogXCJDb3B5IFNlbGVjdGVkIFRleHQgYXMgUXVvdGF0aW9uXCIsXHJcbiAgICAgICAgY29udGV4dHM6IFtcInNlbGVjdGlvblwiXVxyXG4gICAgfSwgb25DcmVhdGVkKTtcclxuXHJcbiAgICBicm93c2VyLmNvbnRleHRNZW51cy5vbkNsaWNrZWQuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKGluZm8sIHRhYikge1xyXG4gICAgICAgIHN3aXRjaCAoaW5mby5tZW51SXRlbUlkKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ0ZXh0LXNlbGVjdGlvbi10by1jbGlwYm9hcmQtYXMtcXVvdGF0aW9uXCI6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpbmZvLnNlbGVjdGlvblRleHQpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coaW5mbylcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgdGl0bGUgPSB0YWIudGl0bGVcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGUgPSBgPiAke2luZm8uc2VsZWN0aW9uVGV4dH1cXG4mbWRhc2g7IF9Tb3VyY2U6IFske3RpdGxlfV0oJHtpbmZvLnBhZ2VVcmx9KV9gXHJcbiAgICAgICAgICAgICAgICBjb3B5VG9DbGlwYm9hcmQodGVtcGxhdGUsIHRlbXBsYXRlKVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBpbml0aWFsaXplQ29udGV4dE1lbnVzXHJcbn0iLCJjb25zdCB1cGRhdGVDaGVja2VyID0gKCkgPT4ge1xyXG4gICAgZnVuY3Rpb24gaW5zdGFsbGVkT3JVcGRhdGVkKGRldGFpbHMpIHtcclxuICAgICAgICBsZXQgdXJsO1xyXG4gICAgICAgIGxldCB2ZXJzaW9uID0gYnJvd3Nlci5ydW50aW1lLmdldE1hbmlmZXN0KCkudmVyc2lvbjtcclxuICAgICAgICBsZXQgcHJldmlvdXNWZXJzaW9uID0gZGV0YWlscy5wcmV2aW91c1ZlcnNpb247XHJcbiAgICAgICAgc3dpdGNoIChkZXRhaWxzLnJlYXNvbikge1xyXG4gICAgICAgICAgICBjYXNlIFwidXBkYXRlXCI6XHJcbiAgICAgICAgICAgICAgICBpZiAodmVyc2lvbiAhPT0gcHJldmlvdXNWZXJzaW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gYnJvd3Nlci5leHRlbnNpb24uZ2V0VVJMKGAvZG9jcy9pbmRleC5odG1sIy9yZWxlYXNlX25vdGVzLyR7dmVyc2lvbn1gKTtcclxuICAgICAgICAgICAgICAgICAgICBicm93c2VyLnRhYnMuY3JlYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBgJHt1cmx9YFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpbnN0YWxsXCI6XHJcbiAgICAgICAgICAgICAgICB1cmwgPSBicm93c2VyLmV4dGVuc2lvbi5nZXRVUkwoXCIvZG9jcy9pbmRleC5odG1sIy9ndWlkZVwiKTtcclxuICAgICAgICAgICAgICAgIGJyb3dzZXIudGFicy5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogYCR7dXJsfWBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGJyb3dzZXIucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcihpbnN0YWxsZWRPclVwZGF0ZWQpXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgdXBkYXRlQ2hlY2tlclxyXG59XHJcbiJdfQ==
