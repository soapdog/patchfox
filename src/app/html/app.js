const nest = require("depnest");
const { h, watch, resolve } = require("mutant");

exports.gives = nest("app.html.app");

exports.needs = nest({
    "app.sync.goTo": "first",
    "app.sync.initialise": "map",
    "router.sync.routes": "first",
    "router.obs.route": "first",
});

exports.create = function (api) {
    return nest("app.html.app", app);

    function app () {
        console.log("STARTING patchfox");

        // runs all the functions in app/sync/initialise
        api.app.sync.initialise();
        console.log("Current route:", resolve(api.router.obs.route()));

        const App = h("App", api.router.obs.route());
      
    
        api.router.obs.route()(newPage => {
            // NOTE: just some logging...
            console.log("route changed", newPage);
        });
      
        return App;
    }
};
