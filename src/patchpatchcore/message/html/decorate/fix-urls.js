const nest = require("depnest");

exports.gives = nest("message.html.decorate");

function replacerMsgID(match, id, offset, string) {
    // p1 is nondigits, p2 digits, and p3 non-alphanumerics
    return "<a href=\"ssb:%" + id;
}

exports.create = (api) => {
    return nest("message.html.decorate", function (element, { msg }) {
        element.innerHTML = element.innerHTML
            .replace(/<a href="#/gi, "<a href=\"ssb:#")
            .replace(/<a href="@/gi, "<a href=\"ssb:@")
            .replace(/target="_blank"/gi, "")
            .replace(/<a href="%([^"]+?)/gi, replacerMsgID);

        return element;
    });
};
