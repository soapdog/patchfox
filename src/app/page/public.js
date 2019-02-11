const nest = require("depnest");
const h = require("mutant/h");

exports.gives = nest("app.page.public");

exports.needs = nest({
    "feed.html.render": "first",
    "feed.pull.public": "first"
});


exports.create = (api) => {
    return nest("app.page.public", () => {
        return h("div.App", [
            api.feed.html.render(api.feed.pull.public)
        ]);
    });
};

