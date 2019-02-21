const nest = require("depnest");

exports.gives = nest("app.sync.initialise");

exports.needs = nest({
    "router.sync.routes": "first",
    "router.obs.route": "first"
});

exports.create = (api) => {
   
    return nest("app.sync.initialise", () => {

        console.log("initialise: binding events for router");

        function processHash() {
            const hash = location.hash || "#";
          
            // Do something useful with the result of the route
            let route = api.router.sync.routes()(hash.slice(1));
            console.log("processHash", route);
            api.router.obs.route().set(route);
        }

        window.addEventListener("hashchange", processHash);
        processHash();
        
    });

};

