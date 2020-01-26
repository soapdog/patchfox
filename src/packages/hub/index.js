const publicView = require("./Public.js");
// const threadView = require("./Thread.js");
// const mentionsView = require("./Mentions.js");
// const channelView = require("./Channel.js");
// const ChannelCard = require("./ChannelCard.js");

patchfox.package({
    name: "hub",
    public: publicView,
    // thread: threadView,
    // mentions: mentionsView,
    view: publicView,
    // channel: channelView,
    // messageTypes: [{
    //     type: "channel",
    //     card: ChannelCard,
    //     short: true
    // }],
    menu: {
        group: "Hub",
        label: "Feeds",
        items: [{
                label: "Public",
                event: "package:go",
                data: {
                    pkg: "hub",
                    view: "public"
                }
            },
            {
                label: "Mentions",
                event: "package:go",
                data: {
                    pkg: "hub",
                    view: "mentions"
                }
            }
        ]
    }
})