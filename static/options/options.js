"use strict"

const secret = document.querySelector("#secret");
const remote = document.querySelector("#remote");
const manifest = {};

/*
Store the currently selected settings using browser.storage.local.
*/
function storeSettings() {
    browser.storage.local.set({
        config: {
            secret,
            remote,
            manifest
        }
    });
}

/*
Update the options UI with the settings values retrieved from storage,
or the default settings if the stored settings are empty.
*/
function updateUI(restoredSettings) {
    remoteInput.value = restoredSettings.config.remote || "";
    secretInput.value = restoredSettings.config.secret || "";
}

function onError(e) {
    console.error(e);
}

/*
On opening the options page, fetch stored settings and update the UI with them.
*/
const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(updateUI, onError);

/*
On blur, save the currently selected settings.
*/
remoteInput.addEventListener("blur", storeSettings);
secretInput.addEventListener("blur", storeSettings);