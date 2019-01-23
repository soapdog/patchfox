const h = require("mutant/html-element");

const Test = () => {
    return h("div", [
        h("h1", "Minimal testing"),
        h("p", [
            h("strong","Your Feed ID: "),
            h("span", window.ssb.sbot.id)
        ])
    ]);
}

module.exports = Test;