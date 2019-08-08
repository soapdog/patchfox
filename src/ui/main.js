import Patchfox from "./Patchfox.svelte";

import {
    loadConfiguration,
    navigate,
    intercept,
} from "./utils.js";

const main = async () => {
    window.ssb = false;

    intercept()

    try {
        await loadConfiguration()

    } catch (n) {
        console.error("initialization error", n)
        switch (n) {
            case "Configuration is missing":
                navigate("/settings")
                break
            default:
                navigate("/error", { error: n })
                break
        }

    }

    const patchfox = new Patchfox({
        target: document.body
    });
}

main()