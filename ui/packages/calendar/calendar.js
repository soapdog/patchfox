const GatheringCard = require("./GatheringCard.js")
const GatheringView = require("./GatheringView.js")
const TimelineView = require("./TimelineView.js");
const ExportView = require("./ExportView.js");
const GatheringActionCard = require("./GatheringActionCard.js");
const { isGathering, isUpdate, isAttendee } = require("ssb-gathering-schema") 

patchfox.package({
  name: "calendar",
  supportedPlatforms: ["nodejs-db1"],
  messageTypes: [
    {
      type: "gathering",
      card: GatheringCard
    },
    {
      type: "about",
      card: GatheringActionCard,
      validator: msg => {
        return isUpdate(msg)
      }
    }
  ],
  gathering: GatheringView,
  timeline: TimelineView,
  export: ExportView,
  menu: {
    group: "Calendar",
    label: "Gatherings",
    items: [
      {
        label: "Future Events",
        event: "package:go",
        data: {
          pkg: "calendar",
          view: "timeline"
        }
      }
    ]
  }
})
