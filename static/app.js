/**
 * APP.JS
 * 
 * OBJECTIVE:
 * This is the main entrypoint of the WebExtension. It needs to check if the configuration is
 * present, then load a suitable driver, then start the application router.
 */

import {PublicView} from "./components/public-view.js"
import {FeedView} from "./components/feed-view.js"
import {ThreadView} from "./components/thread-view.js"
import {SsbSchemaHandler} from "./components/ssb-schema-handler.js"
import {DriverHermiebox} from "./drivers/driver-hermiebox.js"

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
                window.ssb = new DriverHermiebox()

                await ssb.connect(savedData.keys)

                m.route(document.body, "/public/1", {
                    "/public/:comp/:key": PublicView,
                    "/public/:key": PublicView,
                    "/profile/:key...": FeedView,
                    "/thread/:msg...": ThreadView,
                    "/intercept/:hash...": SsbSchemaHandler
                })
                
            } catch (e) {
                console.log("Error trapped by main, can't connect?")
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
