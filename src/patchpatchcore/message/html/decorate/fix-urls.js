const nest = require("depnest");

exports.gives = nest("message.html.decorate");

exports.create = (api) => {
    return nest("message.html.decorate", function (element, { msg }) {
        element.innerHTML = element.innerHTML
            .replace(/<a href="%/gi, "<a href=\"ssb:%")
            .replace(/<a href="#/gi, "<a href=\"ssb:#")
            .replace(/<a href="@/gi, "<a href=\"ssb:@");
        return element;
    });
};
