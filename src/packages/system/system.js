const Peers = require("./Peers.svelte")
const JoinPub = require("./JoinPub.svelte")

patchfox.package({
    name: "system",
    peers: Peers,
    joinPub: JoinPub,
    menu: [
        {
            group: "Patchfox",
            label: "System",
            items: [
                {
                    label: "Join Pub",
                    event: "package:go",
                    data: {
                        pkg: "system",
                        view: "joinPub"
                    }
                },
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