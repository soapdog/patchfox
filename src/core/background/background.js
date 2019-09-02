
const {updateChecker} =  require("./updateChecker");
const {initializeContextMenus} = require("./contextMenus.js")
const {initializeOmniboxFeatures} = require("./search.js")

console.log("starting background script")
initializeContextMenus();
initializeOmniboxFeatures();
updateChecker();

// Cache contacts
