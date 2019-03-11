const nest = require("depnest");
const { h, resolve } = require("mutant");

exports.gives = nest("message.html.author");

exports.needs = nest({
    "about.html.link": "first",
    "about.obs.name": "first",
    "about.html.image": "first"
});

exports.create = function (api) {
    return nest("message.html.author", messageAuthor);

    function messageAuthor (msg) {
        let author = msg.value.author;
        return h("div.author", {title: author}, [
            api.about.html.link(author)
        ]);
    }
};
