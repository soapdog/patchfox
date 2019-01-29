const inject = require("./inject");
let routes = false;

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
    if (!routes) {
        routes = require("./routes");
    }
    
    const hash = location.hash || "#";

    console.log("hash changed", hash);

    let root = document.getElementById("root");
    while (root.hasChildNodes()) {
        root.removeChild(root.firstChild);
    }
    root.appendChild(routes(hash.slice(1)));
};


browser.storage.local.get().then(configurationPresent, configurationMissing);
window.addEventListener("hashchange", processHash);
