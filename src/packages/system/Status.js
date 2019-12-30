const m = require("mithril")
const prettyPrintJson = require("pretty-print-json")

class Status {
    constructor() {
        let sbot = ssb.sbot;

        this.loading = true;
        this.status;

        sbot.status((err, data) => {
            console.log("data", data);
            console.log("err", err);
            this.loading = false;
            this.status = prettyPrintJson.toHtml(data);
            m.redraw()
        });
    }
    view() {



        return [
            m("h1.title", "Status"),
            this.loading ? m("div.loading") : m("pre.container", m.trust(this.status))
        ]
    }
}

module.exports = Status