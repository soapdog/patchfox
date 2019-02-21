const nest = require("depnest");

exports.gives = nest("app.sync.initialise");

exports.create = function (api) {
    return nest("app.sync.initialise", errorCatcher);

    function errorCatcher() {
        console.log("Initialise: adding error catcher");
        window.addEventListener("error", ev => {
            console.error("error caught by global error catcher", ev);
        });
        return true;
    }
};
