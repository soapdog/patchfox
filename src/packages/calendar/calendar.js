const GatheringCard = require("./GatheringCard.svelte")
const GatheringView = require("./GatheringView.svelte")
const TimelineView = require("./TimelineView.svelte");
const ExportView = require("./ExportView.svelte");


patchfox.package({
    name: "calendar",
    messageTypes: [
        {
            type: "gathering",
            card: GatheringCard
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
          },
          {
            label: "Export Events",
            event: "package:go",
            data: {
              pkg: "calendar",
              view: "export"
            }
          }
        ]
      }
})