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
