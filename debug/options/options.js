"use strict";

const secretInput = document.querySelector("#secret");
const remoteInput = document.querySelector("#remote");
const fileInputTrigger = document.querySelector("#select-secret");
const saveButton = document.querySelector("#save");

let keys, remote = false;

function saveConfigurationRequest(ev) {
    keys = JSON.parse(secretInput.value);
    remote = remoteInput.value;
    storeSettings(keys, remote, manifest);
    browser.tabs.create({
        url: browser.extension.getURL("/index.html#/test-configuration")
    });
}

/*
Store the currently selected settings using browser.storage.local.
*/
function storeSettings (keys, remote, manifest) {
    browser.storage.local.set({
        keys,
        remote,
        manifest
    });
}

function selectedFile(ev) {
    console.log("Evento!");
    const secretFile = ev.target.files[0];
    const reader = new FileReader();
    reader.onload = function (evt) {
        console.log(evt.target.result);
        const contents = evt.target.result;
        let secret = contents.split("\n").filter(function (line) {
            return line.indexOf("#") != 0;
        });
        secret = JSON.parse(secret.join("\n"));
        console.log("secret", secret);
        keys = secret;
        remote = `ws://localhost:8989~shs:${secret.id.slice(0, secret.id.indexOf("=") + 1)}`;
        updateUI({keys, remote});
    };
    reader.readAsText(secretFile);
}

/*
Update the options UI with the settings values retrieved from storage,
or the default settings if the stored settings are empty.
*/
function updateUI ({keys, remote}) {
    remoteInput.value = remote || "";
    secretInput.value = JSON.stringify(keys) || "";

}

function onError (e) {
    console.error(e);
}

/*
On opening the options page, fetch stored settings and update the UI with them.
*/
const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(updateUI, onError);


fileInputTrigger.addEventListener("change", selectedFile, false);
saveButton.addEventListener("click", saveConfigurationRequest);