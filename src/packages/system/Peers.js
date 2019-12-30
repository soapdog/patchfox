const m = require("mithril")

class Peers {

    constructor() {
        let sbot = ssb.sbot;

        this.loading = true;
        this.peerlist = [];

        sbot.gossip.peers((err, data) => {
            console.log("data", data);
            console.log("err", err);
            this.loading = false;
            this.peerlist = data;
            m.redraw()
        });
    }

    view() {

        const peerTable = () => {
            return m("table.table.table-scroll", [
                m("thead", m("tr", [
                    m("th", "Address"),
                    m("th", "Type"),
                    m("th", "Key")
                ])),
                m("tbody", this.peerlist.map(peer => {
                    return m("tr", { key: peer.address }, [
                        m("td", m("span", peer.address.split(":")[1])),
                        m("td", peer.type),
                        m("td", m("a", {
                            href: patchfox.url("contact", "profile", { feed: peer.key })
                        }, peer.key))
                    ])
                }))
            ])
        }


        return [
            m("h1.title", "Peers"),
            this.loading ? m("div.loading") : peerTable()
        ]
    }
}

module.exports = Peers