const GatheringCard = require("./GatheringCard.svelte")
const GatheringView = require("./GatheringView.svelte")
const TimelineView = require("./TimelineView.svelte");
const ExportView = require("./ExportView.svelte");
const GatheringActionCard = require("./GatheringActionCard.svelte");


patchfox.package({
    name: "calendar",
    messageTypes: [
        {
            type: "gathering",
            card: GatheringCard
        },
        {
          type: "about",
          card: GatheringActionCard,
          validator: msg => msg.value.content.about && msg.value.content.about.startsWith("%")
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
