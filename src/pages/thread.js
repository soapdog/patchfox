const h = require("mutant/html-element");

const Thread = ({msgID}) => {
    return h("h1", `Thread: ${msgID}`);
}

module.exports = Thread;