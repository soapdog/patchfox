const Patchfox = require("./Patchfox.svelte");

const {
    navigate,
    intercept,
} =  require("./utils.js");

const { loadConfiguration } = require("./prefs.js")

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