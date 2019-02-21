const nest = require("depnest");

exports.gives = nest("message.html.decorate");

function replaceMsgID(match, id, offset, string) {
    // p1 is nondigits, p2 digits, and p3 non-alphanumerics
    return "<a class=\"thread-link\" href=\"#/thread/%25" + encodeURIComponent(id);
}

function replaceChannel(match, id, offset, string) {
    // p1 is nondigits, p2 digits, and p3 non-alphanumerics
    return "<a class=\"channel-link\" href=\"#/channel/" + id;
}


function replaceFeedID(match, id, offset, string) {
    // p1 is nondigits, p2 digits, and p3 non-alphanumerics
    return "<a class=\"feed-link\" href=\"#/feed/%40" + encodeURIComponent(id);
}


exports.create = (api) => {
    return nest("message.html.decorate", function (element, { msg }) {
        element.innerHTML = element.innerHTML
            // .replace(/<a href="#([^"]+?)/gi, replaceChannel)
            .replace(/<a href="@([^"]+?)/gi, replaceFeedID)
            .replace(/target="_blank"/gi, "")
            .replace(/<a href="%([^"]+?)/gi, replaceMsgID);

        return element;
    });
};
