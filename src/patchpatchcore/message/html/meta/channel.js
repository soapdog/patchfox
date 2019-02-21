const h = require("mutant/h");
const nest = require("depnest");

exports.gives = nest("message.html.meta");

exports.create = (api) => {
    return nest("message.html.meta", function renderChannel (msg) {
        const { channel } = msg.value.content;
        if (channel && msg.value.content.type !== "channel") return h("a.channel", { href: `#/channel/${channel}` }, [`#${channel}`]);
    });
};
