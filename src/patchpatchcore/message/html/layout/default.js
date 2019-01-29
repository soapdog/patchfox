const h = require("mutant/h");
var nest = require("depnest");

exports.needs = nest("message.html", {
    backlinks: "first",
    author: "first",
    meta: "map",
    action: "map",
    timestamp: "first"
});

exports.gives = nest("message.html.layout");

exports.create = (api) => {
    return nest("message.html.layout", messageLayout);

    function messageLayout (msg, opts) {
        if (!(opts.layout === undefined || opts.layout === "default")) return;
        return h("div", {
            classList: "Message"
        }, [
            h("header.author", {}, api.message.html.author(msg)),
            h("section.timestamp", {}, api.message.html.timestamp(msg)),
            h("section.title", {}, opts.title),
            h("section.meta", {}, api.message.html.meta(msg)),
            h("section.content", {}, opts.content),
            h("section.raw-content"),
            h("section.actions", {}, api.message.html.action(msg)),
            h("footer.backlinks", {}, api.message.html.backlinks(msg))
        ]);
    }
};
