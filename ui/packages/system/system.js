const Peers = require("./Peers.js")
const JoinPub = require("./JoinPub.js")
const JoinRoom = require("./JoinRoom.js")
const Status = require("./Status.js")
const HttpAuth = require("./httpAuth.js")
const TestArea = require("./TestArea.js")

patchfox.package({
  name: "system",
  supportedPlatforms: ["all"],
  peers: Peers,
  joinPub: JoinPub,
  joinRoom: JoinRoom,
  status: Status,
  httpAuth: HttpAuth,
  testArea: TestArea,
  menu: [
    {
      group: "Application",
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
        },
        {
          label: "test",
          event: "package:go",
          data: {
            pkg: "system",
            view: "testArea"
          }
        }
      ]
    }
  ]
})
