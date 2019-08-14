
const {updateChecker} =  require("./updateChecker");
const {initializeContextMenus} = require("./contextMenus.js")

console.log("starting background script")
initializeContextMenus();
updateChecker();

// Cache contacts
