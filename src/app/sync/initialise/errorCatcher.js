const nest = require("depnest");

exports.gives = nest("app.sync.initialise");

exports.create = function (api) {
    return nest("app.sync.initialise", errorCatcher);

    function errorCatcher() {
        window.addEventListener("error", ev => {
            console.error("error caught by global error catcher", ev);
        });
    }
};
