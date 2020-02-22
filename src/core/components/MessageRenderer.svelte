<script>
  const GenericMsg = require("./GenericMsg.svelte");
  const _ = require("lodash");

  export let msg;

  let messageTypes = [];

  let packagesForMessageTypes = _.filter(
    patchfox.packages,
    p => p.messageTypes
  );

  let type;

  const makeGenericValidatorForType = typeToBuildFor => {
    return msg => {
      let type;
      if (typeof msg.value.content === "string") {
        type = "private";
      } else {
        type = msg.value.content.type;
      }
      return type === typeToBuildFor;
    };
  };

  packagesForMessageTypes.forEach(p => {
    p.messageTypes.forEach(mt => {
      let type = mt.type;
      let view = mt.card;
      let short = mt.short || false;
      let validator = mt.validator || makeGenericValidatorForType(type);
      messageTypes.push({ type, validator, view, short });
    });
  });

  let selectedRenderer = false;

  if (typeof msg.value.content === "string") {
    type = "private";
  } else {
    type = msg.value.content.type;
  }

  for (let p of messageTypes) {
    if (p.validator(msg)) {
      selectedRenderer = p.view;
      break;
    }
  }

  if (!selectedRenderer) {
    selectedRenderer = GenericMsg;
  }
</script>

<svelte:component this={selectedRenderer} {msg} />
