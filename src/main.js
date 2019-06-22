import Patchfox from "./Patchfox.svelte";
import {
    connected,
    loadConfiguration,
    connect,
    reconnect,
    navigate
} from "./utils.js";

const main = async () => {
    window.ssb = false;

    try {
        await loadConfiguration()
        await connect()

        let interval = setInterval(() => {
            if (hermiebox.sbot) {
                hermiebox.sbot.whoami((err, v) => {
                    if (err) {
                        console.error("can't call whoami", err);
                        reconnect().catch(n => {
                            console.error("can't reconnect");
                            clearInterval(interval);
                            navigate("/error", { error: n });
                        });
                    }
                });
            }
        }, 5000);
    } catch (n) {
        if (n === "Configuration is missing") {
            navigate("/settings")
        }
    }

    const patchfox = new Patchfox({
        target: document.body
    });

}

main()