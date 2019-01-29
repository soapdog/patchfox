
function goPublic() {
    const url = browser.extension.getURL("index.html");
    browser.tabs.create({
        url: `${url}#public`
    });
    window.close();
}


function goSettings() {
    browser.runtime.openOptionsPage();
    window.close();
}

function goHelp() {
    const url = browser.extension.getURL("help/help.html");
    browser.tabs.create({
        url: url
    });
    window.close();
}

document.getElementById("options-trigger").addEventListener("click", (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    goSettings();
});


document.getElementById("go-to-public").addEventListener("click", (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    goPublic();
});


document.getElementById("go-to-help").addEventListener("click", (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    goHelp();
});

keymage("p", goPublic);
keymage("s", goSettings);


