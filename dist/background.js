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
        let lines = info.selectionText.split(`\n`).map(l => `> ${l}`).join(`\n`)
        template = `${lines}\n> &mdash; _Source: [${tab.title}](${info.pageUrl})_`
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS9iYWNrZ3JvdW5kL2JhY2tncm91bmQuanMiLCJzcmMvY29yZS9iYWNrZ3JvdW5kL2NvbnRleHRNZW51cy5qcyIsInNyYy9jb3JlL2JhY2tncm91bmQvc2VhcmNoLmpzIiwic3JjL2NvcmUvYmFja2dyb3VuZC91cGRhdGVDaGVja2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXHJcbmNvbnN0IHt1cGRhdGVDaGVja2VyfSA9ICByZXF1aXJlKFwiLi91cGRhdGVDaGVja2VyXCIpO1xyXG5jb25zdCB7aW5pdGlhbGl6ZUNvbnRleHRNZW51c30gPSByZXF1aXJlKFwiLi9jb250ZXh0TWVudXMuanNcIilcclxuY29uc3Qge2luaXRpYWxpemVPbW5pYm94RmVhdHVyZXN9ID0gcmVxdWlyZShcIi4vc2VhcmNoLmpzXCIpXHJcblxyXG5jb25zb2xlLmxvZyhcInN0YXJ0aW5nIGJhY2tncm91bmQgc2NyaXB0XCIpXHJcbmluaXRpYWxpemVDb250ZXh0TWVudXMoKTtcclxuaW5pdGlhbGl6ZU9tbmlib3hGZWF0dXJlcygpO1xyXG51cGRhdGVDaGVja2VyKCk7IiwiZnVuY3Rpb24gb25DcmVhdGVkKCkge1xuICBpZiAoYnJvd3Nlci5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgIGNvbnNvbGUubG9nKGBFcnJvcjogJHticm93c2VyLnJ1bnRpbWUubGFzdEVycm9yfWApO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUubG9nKFwiQ29udGV4dCBtZW51IGl0ZW0gY3JlYXRlZCBzdWNjZXNzZnVsbHlcIik7XG4gIH1cbn1cblxuZnVuY3Rpb24gY29weVRvQ2xpcGJvYXJkKHRleHQsIGh0bWwpIHtcbiAgZnVuY3Rpb24gb25jb3B5KGV2ZW50KSB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvcHlcIiwgb25jb3B5LCB0cnVlKTtcbiAgICAvLyBIaWRlIHRoZSBldmVudCBmcm9tIHRoZSBwYWdlIHRvIHByZXZlbnQgdGFtcGVyaW5nLlxuICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXG4gICAgLy8gT3ZlcndyaXRlIHRoZSBjbGlwYm9hcmQgY29udGVudC5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LmNsaXBib2FyZERhdGEuc2V0RGF0YShcInRleHQvcGxhaW5cIiwgdGV4dCk7XG4gICAgZXZlbnQuY2xpcGJvYXJkRGF0YS5zZXREYXRhKFwidGV4dC9odG1sXCIsIGh0bWwpO1xuICB9XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjb3B5XCIsIG9uY29weSwgdHJ1ZSk7XG5cbiAgLy8gUmVxdWlyZXMgdGhlIGNsaXBib2FyZFdyaXRlIHBlcm1pc3Npb24sIG9yIGEgdXNlciBnZXN0dXJlOlxuICBkb2N1bWVudC5leGVjQ29tbWFuZChcImNvcHlcIik7XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVDb250ZXh0TWVudXMoKSB7XG4gIGJyb3dzZXIuY29udGV4dE1lbnVzLmNyZWF0ZSh7XG4gICAgaWQ6IFwidGV4dC1zZWxlY3Rpb24tdG8tY2xpcGJvYXJkLWFzLXF1b3RhdGlvblwiLFxuICAgIHRpdGxlOiBcIkNvcHkgc2VsZWN0ZWQgdGV4dCBhcyBxdW90YXRpb25cIixcbiAgICBjb250ZXh0czogW1wic2VsZWN0aW9uXCJdXG4gIH0sIG9uQ3JlYXRlZCk7XG5cbiAgYnJvd3Nlci5jb250ZXh0TWVudXMuY3JlYXRlKHtcbiAgICBpZDogXCJwYWdlLWFjdGlvbi10by1jbGlwYm9hcmQtYXMtbGlua1wiLFxuICAgIHRpdGxlOiBcIkNvcHkgbGluayB0byB0aGUgY3VycmVudCBwYWdlXCIsXG4gICAgY29udGV4dHM6IFtcImFsbFwiLCBcInBhZ2VfYWN0aW9uXCJdXG4gIH0sIG9uQ3JlYXRlZCk7XG5cbiAgYnJvd3Nlci5jb250ZXh0TWVudXMuY3JlYXRlKHtcbiAgICBpZDogXCJsaW5rLXRvLWNsaXBib2FyZC1hcy1saW5rXCIsXG4gICAgdGl0bGU6IFwiQ29weSBsaW5rXCIsXG4gICAgY29udGV4dHM6IFtcImxpbmtcIl1cbiAgfSwgb25DcmVhdGVkKTtcblxuICBicm93c2VyLmNvbnRleHRNZW51cy5vbkNsaWNrZWQuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKGluZm8sIHRhYikge1xuICAgIGxldCB0ZW1wbGF0ZVxuICAgIGNvbnNvbGUuZGlyKFwiaW5mb1wiLCBpbmZvKVxuICAgIHN3aXRjaCAoaW5mby5tZW51SXRlbUlkKSB7XG4gICAgICBjYXNlIFwidGV4dC1zZWxlY3Rpb24tdG8tY2xpcGJvYXJkLWFzLXF1b3RhdGlvblwiOlxuICAgICAgICBsZXQgbGluZXMgPSBpbmZvLnNlbGVjdGlvblRleHQuc3BsaXQoYFxcbmApLm1hcChsID0+IGA+ICR7bH1gKS5qb2luKGBcXG5gKVxuICAgICAgICB0ZW1wbGF0ZSA9IGAke2xpbmVzfVxcbj4gJm1kYXNoOyBfU291cmNlOiBbJHt0YWIudGl0bGV9XSgke2luZm8ucGFnZVVybH0pX2BcbiAgICAgICAgY29weVRvQ2xpcGJvYXJkKHRlbXBsYXRlLCB0ZW1wbGF0ZSlcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwicGFnZS1hY3Rpb24tdG8tY2xpcGJvYXJkLWFzLWxpbmtcIjpcbiAgICAgICAgdGVtcGxhdGUgPSBgWyR7dGFiLnRpdGxlfV0oJHt0YWIudXJsfSlgXG4gICAgICAgIGNvcHlUb0NsaXBib2FyZCh0ZW1wbGF0ZSwgdGVtcGxhdGUpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImxpbmstdG8tY2xpcGJvYXJkLWFzLWxpbmtcIjpcbiAgICAgICAgdGVtcGxhdGUgPSBgWyR7aW5mby5saW5rVGV4dH1dKCR7aW5mby5saW5rVXJsfSlgXG4gICAgICAgIGNvcHlUb0NsaXBib2FyZCh0ZW1wbGF0ZSwgdGVtcGxhdGUpXG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGluaXRpYWxpemVDb250ZXh0TWVudXNcbn1cbiIsImNvbnN0IGluaXRpYWxpemVPbW5pYm94RmVhdHVyZXMgPSAoKSA9PiB7XHJcbiAgICBicm93c2VyLm9tbmlib3guc2V0RGVmYXVsdFN1Z2dlc3Rpb24oe1xyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBgU2VhcmNoIFNlY3VyZSBTY3V0dGxlYnV0dGBcclxuICAgIH0pO1xyXG5cclxuICAgIGJyb3dzZXIub21uaWJveC5vbklucHV0RW50ZXJlZC5hZGRMaXN0ZW5lcigodGV4dCwgZGlzcG9zaXRpb24pID0+IHtcclxuICAgICAgICBsZXQgcXVlcnkgPSBlbmNvZGVVUklDb21wb25lbnQodGV4dCk7XHJcbiAgICAgICAgbGV0IHVybCA9IGAvaW5kZXguaHRtbD9xdWVyeT0ke3F1ZXJ5fSZwa2c9c2VhcmNoYDtcclxuXHJcbiAgICAgICAgc3dpdGNoIChkaXNwb3NpdGlvbikge1xyXG4gICAgICAgICAgICBjYXNlIFwiY3VycmVudFRhYlwiOlxyXG4gICAgICAgICAgICAgICAgYnJvd3Nlci50YWJzLnVwZGF0ZSh7IHVybCB9KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibmV3Rm9yZWdyb3VuZFRhYlwiOlxyXG4gICAgICAgICAgICAgICAgYnJvd3Nlci50YWJzLmNyZWF0ZSh7IHVybCB9KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibmV3QmFja2dyb3VuZFRhYlwiOlxyXG4gICAgICAgICAgICAgICAgYnJvd3Nlci50YWJzLmNyZWF0ZSh7IHVybCwgYWN0aXZlOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGluaXRpYWxpemVPbW5pYm94RmVhdHVyZXNcclxufSIsImNvbnN0IHVwZGF0ZUNoZWNrZXIgPSAoKSA9PiB7XHJcbiAgICBmdW5jdGlvbiBpbnN0YWxsZWRPclVwZGF0ZWQoZGV0YWlscykge1xyXG4gICAgICAgIGxldCB1cmw7XHJcbiAgICAgICAgbGV0IHZlcnNpb24gPSBicm93c2VyLnJ1bnRpbWUuZ2V0TWFuaWZlc3QoKS52ZXJzaW9uO1xyXG4gICAgICAgIGxldCBwcmV2aW91c1ZlcnNpb24gPSBkZXRhaWxzLnByZXZpb3VzVmVyc2lvbjtcclxuICAgICAgICBzd2l0Y2ggKGRldGFpbHMucmVhc29uKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ1cGRhdGVcIjpcclxuICAgICAgICAgICAgICAgIGlmICh2ZXJzaW9uICE9PSBwcmV2aW91c1ZlcnNpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICB1cmwgPSBicm93c2VyLmV4dGVuc2lvbi5nZXRVUkwoYC9kb2NzL2luZGV4Lmh0bWwjL3JlbGVhc2Vfbm90ZXMvJHt2ZXJzaW9ufWApO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyb3dzZXIudGFicy5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGAke3VybH1gXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImluc3RhbGxcIjpcclxuICAgICAgICAgICAgICAgIHVybCA9IGJyb3dzZXIuZXh0ZW5zaW9uLmdldFVSTChcIi9kb2NzL2luZGV4Lmh0bWwjL2d1aWRlXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJvd3Nlci50YWJzLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBgJHt1cmx9YFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYnJvd3Nlci5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKGluc3RhbGxlZE9yVXBkYXRlZClcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICB1cGRhdGVDaGVja2VyXHJcbn1cclxuIl19
