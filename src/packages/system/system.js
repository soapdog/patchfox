const Peers = require("./Peers.svelte")
const JoinPub = require("./JoinPub.svelte")
const Status = require("./Status.svelte")

patchfox.package({
    name: "system",
    peers: Peers,
    joinPub: JoinPub,
    status: Status,
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
                    label: "Status",
                    event: "package:go",
                    data: {
                        pkg: "system",
                        view: "status"
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