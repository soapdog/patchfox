const core = require("./core/core.js");
const packages = require("./packages/packages.js");
const themes = require("./themes/themes.js");
const WM = require("./wm.svelte");

core.start().then(() => {
    const wm = new WM({
        target: document.body
    });
});
