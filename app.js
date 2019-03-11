import {DriverHermiebox as Driver} from "./drivers/driver-hermiebox.js"

let main = async () => {
    
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
                let driver = new Driver()

                driver.connect(savedData.keys)

            } catch (e) {
                console.log("Error trapped by main, can't connect?");
                console.error(e);
            }
        }
    };

    const configurationMissing = () => {
        window.location = "/help/no_configuration.html";
    };

    browser.storage.local.get().then(configurationPresent, configurationMissing);
}

console.log("starting patchfox")
main()
