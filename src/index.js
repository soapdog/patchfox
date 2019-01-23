const h = require("mutant/html-element");
const ref = require("ssb-ref");
const routes = require("./routes");
const inject = require("./inject");


/**
 * Below is the configuration check and application launch routine.
 */


const configurationIsOK = (savedData) => {
    return (savedData.hasOwnProperty("keys")
        || savedData.hasOwnProperty("keys")
        || savedData.hasOwnProperty("keys"));
};

const configurationPresent = async (savedData) => {
    console.log("configuration", savedData);
    if (!configurationIsOK(savedData)) {
        configurationMissing();
    } else {
        try {
            window.ssb = await inject(savedData);
            processHash();
        } catch (e) {
            console.error(e);
        }
    }
};
const configurationMissing = () => {
    window.location = "/help/no_configuration.html";
};

const processHash = () => {
    const hash = location.hash || '#';

    console.log("hash changed", hash);

    let root = document.getElementById("root");
    while (root.hasChildNodes()) {
        root.removeChild(root.firstChild);
    }
    root.appendChild(routes(hash.slice(1)));
}


browser.storage.local.get().then(configurationPresent, configurationMissing);
window.addEventListener('hashchange', processHash);
