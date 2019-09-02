const kernel = require("./kernel/kernel.js");
const platforms = require("./platforms/platforms.js");
const runtimes = require("./runtimes/runtimes.js");

if (window) {
    window.patchfox = {};
    Object.assign(window.patchfox, kernel);
    Object.assign(window.patchfox, platforms); 
    Object.assign(window.patchfox, runtimes); 
}

function start() {
    console.log("plz start patchfox")
    // load configuration.
    // connect.
}

module.exports = {
    start
}