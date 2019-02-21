const nest = require("depnest");

exports.gives = nest("app.sync.goTo");

exports.create = (api) => {

    return nest("app.sync.goTo", (url) => {

        window.location.hash = `#{url}`;
        return true;
    });
};

