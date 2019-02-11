const inject = require("./inject");

const configurationIsOK = (savedData) => {
    return (savedData.hasOwnProperty("keys")
        || savedData.hasOwnProperty("keys")
        || savedData.hasOwnProperty("keys"));
};

const configurationPresent = async (savedData) => {
    if (!configurationIsOK(savedData)) {
        configurationMissing();
    } else {
        try {
            window.ssb = await inject(savedData);

            let main = require("./main");

            let root = document.getElementById("root");
            while (root.hasChildNodes()) {
                root.removeChild(root.firstChild);
            }
            root.appendChild(main);

        } catch (e) {
            console.error(e);
        }
    }
};

const configurationMissing = () => {
    window.location = "/help/no_configuration.html";
};

browser.storage.local.get().then(configurationPresent, configurationMissing);
