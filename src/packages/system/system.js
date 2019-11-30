const Peers = require("./Peers.svelte");

patchfox.package({
    name: "system",
    peers: Peers,
    menu: [
        {
            group: "Patchfox",
            items: [
                {
                    label: "Peer List",
                    event: "package:go",
                    data: {
                        pkg: "system",
                        view: "peers"
                    }
                }
            ]
        }
    ]
})