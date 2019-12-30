const Peers = require("./Peers.js")
const JoinPub = require("./JoinPub.js")
const Status = require("./Status.js")

patchfox.package({
    name: "system",
    peers: Peers,
    joinPub: JoinPub,
    status: Status,
    menu: [{
        group: "Patchfox",
        label: "System",
        items: [{
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
    }]
})