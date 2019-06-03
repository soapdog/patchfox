
function goPublic() {
    browser.tabs.create({
        url: "/index.html#/public"
    });
    window.close();
}

function goCompose() {
    browser.tabs.create({
        url: "/index.html#/compose"
    });
    window.close();
}


function goSettings() {
    browser.runtime.openOptionsPage();
    window.close();
}

function goHelp() {
    const url = browser.extension.getURL("docs/index.html");
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

document.getElementById("compose").addEventListener("click", (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    goCompose();
});


document.getElementById("go-to-help").addEventListener("click", (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    goHelp();
});

keymage("p", goPublic);
keymage("s", goSettings);
keymage("c", goCompose);

if (!browser) {
    window.browser = window.chrome;
}

console.log("browser", browser);

