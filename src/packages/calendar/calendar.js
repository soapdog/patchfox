const GatheringCard = require("./GatheringCard.svelte");
const GatheringView = require("./GatheringView.svelte");
const TimelineView = require("./TimelineView.svelte");
const ExportView = require("./ExportView.svelte");
const AddEventView = require("./AddEventView.svelte");
const GatheringActionCard = require("./GatheringActionCard.svelte");
const { isGathering, isUpdate, isAttendee } = require("ssb-gathering-schema");

// fixing: moz-extension://b672cc11-25cf-4b47-827d-dda34ed36f13/index.html?lt=1621837007396&pkg=hub&view=public

patchfox.package({
  name: "calendar",
  supportedPlatforms: ["nodejs-ssb"],
  messageTypes: [
    {
      type: "gathering",
      card: GatheringCard,
    },
    {
      type: "about",
      card: GatheringActionCard,
      validator: (msg) => {
        return isUpdate(msg);
      },
    },
  ],
  gathering: GatheringView,
  timeline: TimelineView,
  addEvent: AddEventView,
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
          view: "timeline",
        },
      },
      {
        label: "Create New Event",
        event: "package:go",
        data: {
          pkg: "calendar",
          view: "addEvent",
        },
      },
    ],
  },
});
