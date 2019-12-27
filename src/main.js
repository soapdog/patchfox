const m = require("mithril");
const core = require("./core/core.js");
const packages = require("./packages/packages.js");
const themes = require("./themes/themes.js");
const WM = require("./wm.js");

core.start().then(() => {
    m.mount(document.body, WM)
});