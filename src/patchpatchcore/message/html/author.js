const nest = require("depnest");
const { h, watch } = require("mutant");

exports.gives = nest("message.html.author");

exports.needs = nest({
    "about.html.link": "first",
    "about.obs.name": "first"
});

exports.create = function (api) {
    return nest("message.html.author", messageAuthor);

    function messageAuthor (msg) {
        return h("div", {title: msg.value.author}, [
            api.about.obs.name(msg.value.author)
        ]);
    }
};
