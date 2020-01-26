const m = require("mithril")
const GenericMessageCard = require("./GenericMessageCard")
const _ = require("lodash")

class MessageRenderer {
    view(vnode) {
        let msg = vnode.attrs.msg
        let showRaw = vnode.attrs.showRaw
        let messageTypes = [];
        let type

        let packagesForMessageTypes = _.filter(
            patchfox.packages,
            p => p.messageTypes
        );

        const makeGenericValidatorForType = typeToBuildFor => {
            return msg => {
                let type;
                if (typeof msg.value.content === "string") {
                    type = "private";
                } else {
                    type = msg.value.content.type;
                }
                return type === typeToBuildFor;
            };
        };

        packagesForMessageTypes.forEach(p => {
            p.messageTypes.forEach(mt => {
                let type = mt.type;
                let view = mt.card;
                let short = mt.short || false;
                let validator = mt.validator || makeGenericValidatorForType(type);
                messageTypes.push({ type, validator, view, short });
            });
        });

        let selectedRenderer = false;

        if (typeof msg.value.content === "string") {
            type = "private";
        } else {
            type = msg.value.content.type;
        }

        if (msg.value.private) {
            privateMsgForYou = true;
        }

        for (let p of messageTypes) {
            if (p.validator(msg)) {
                selectedRenderer = p.view;
                shortCard = p.short;
                break;
            }
        }

        if (!selectedRenderer) {
            selectedRenderer = GenericMessageCard
        }

        return m(selectedRenderer, {
            msg,
            showRaw
        })

    }
}

module.exports = MessageRenderer