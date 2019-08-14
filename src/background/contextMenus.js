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