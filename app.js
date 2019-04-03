/**
 * APP.JS
 * 
 * OBJECTIVE:
 * This is the main entrypoint of the WebExtension. It needs to check if the configuration is
 * present, then load a suitable driver, then start the application router.
 */

import {getDriver} from "./drivers/driver.js"
import {PublicView} from "./components/public-view.js"
import {FeedView} from "./components/feed-view.js"

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
                let driver = getDriver()

                await driver.connect(savedData.keys)

                m.route(document.body, "/public", {
                    "/public": PublicView,
                    "/profile/:feed": FeedView
                })
                
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
