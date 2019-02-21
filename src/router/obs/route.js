const nest = require("depnest");
const { Value } = require("mutant");

exports.gives = nest("router.obs.route");

exports.needs = nest({
    "router.sync.routes": "first"
});

exports.create = (api) => {
    var _location = Value();

    return nest("router.obs.route", () => {

        return _location;
    });
};

