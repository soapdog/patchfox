/*
On startup, connect to the "sbot_native_app" app.
*/
var btn = document.getElementById("publish");
var contentEl = document.getElementById("content");
var port = browser.runtime.connectNative("sbot_native_app");
console.log("port", port);

/*
Listen for messages from the app.
*/

port.onDisconnect.addListener(data => {
    console.log("disconnect", data);
})


port.onMessage.addListener(response => {
    console.log("Received: ", response);

    if (!response.error) {
        let post = response.data;
        displaySuccessNotification(post);
        contentEl.value = "";
    } else {
        let error = response.error;
        displayErrorNotification(error);
    }

    enablePublishAction();
});

/*
On a click on the browser action, send the app a message.
*/



function disablePublishAction() {
    btn.setAttribute("disabled", true);
}

function enablePublishAction() {
    btn.removeAttribute("disabled");
}

function displayErrorNotification(error) {
    let errorTemplate = document.getElementById("error-post-notification").innerHTML;
    let notificationEl = document.getElementById("notification");

    notificationEl.insertAdjacentHTML("beforeend", errorTemplate);
    bindCloseNotificationButton();
}


function displaySuccessNotification(post) {
    let successTemplate = document.getElementById("success-post-notification").innerHTML;
    let notificationEl = document.getElementById("notification");
    let re = /smblink/gi

    successTemplate = successTemplate.replace(re, post.key);

    notificationEl.insertAdjacentHTML("beforeend", successTemplate);
    bindCloseNotificationButton();
}

function clearNotifications() {
    document.getElementById("notification").innerHTML = "";
}

function bindCloseNotificationButton() {
    document.querySelector("#notification .delete").addEventListener("click", clearNotifications)
}

btn.addEventListener("click", ev => {
    disablePublishAction()
    let content = contentEl.value;
    let data = { type: "post", text: content };

    console.log("new post", data);

    port.postMessage({ cmd: "publish", data: data });
});