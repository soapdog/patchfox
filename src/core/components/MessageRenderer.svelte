<script>
  const GenericMsg = require("./GenericMsg.svelte");
  const AvatarChip = require("./AvatarChip.svelte");
  const Card = require("./ui/Card.svelte");
  const MessageDropdown = require("./MessageDropdown.svelte");
  const AvatarTile = require("./AvatarTile.svelte");
  const MessageRaw = require("./MessageRaw.svelte");

  const { timestamp } = require("./timestamp.js");
  const { isMessageBlured } = require("../platforms/ssb/abusePrevention.js");
  const _ = require("lodash");

  export let msg;

  let feed = msg.value.author;
  let showRaw = false;
  let dropdownActive = false;
  let privateMsgForYou = false;

  let messageTypes = [];

  let packagesForMessageTypes = _.filter(
    patchfox.packages,
    p => p.messageTypes
  );

  let type;
  let shortCard = false;

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

  if (msg.value.private) {
    privateMsgForYou = true;
  }

  for (let p of messageTypes) {
    if (p.validator(msg)) {
      selectedRenderer = p.view;
      shortCard = p.short;
      break;
    }
  }

  if (!selectedRenderer) {
    selectedRenderer = GenericMsg;
  }

  let blured = isMessageBlured(msg);

  const toggleRawMessage = () => {
    showRaw = !showRaw;
    dropdownActive = false;
  };

  const goProfile = ev => {
    if (ev.ctrlKey) {
      window.open(
        `?pkg=contacs&view=profile&feed=${encodeURIComponent(feed)}#/profile`
      );
    } else {
      patchfox.go("contacts", "profile", { feed });
    }
  };
</script>

<style>
  .blured img {
    filter: blur(20px) !important;
  }

  .blured {
    border: solid 2px red;
  }
  .raw-content {
    width: 50%;
  }

  .feed-display {
    cursor: pointer;
  }

  .channel-display {
    cursor: pointer;
  }

  .private {
    border: solid 2px orange;
  }
</style>

{#if !shortCard}
  <Card {blured} border={privateMsgForYou}>
    <div slot="card-header">
      <div class="float-left">
        <div class="card-title">
          <AvatarTile {feed} time={msg.value.timestamp} on:click={goProfile} />
        </div>
      </div>
      {#if privateMsgForYou}
        <span class="label">PRIVATE</span>
      {/if}
      <div class="float-right">
        <span
          class="text-gray channel-display"
          on:click={() => {
            patchfox.go('hub', 'channel', {
              channel: msg.value.content.channel
            });
          }}>
          {#if msg.value.content.channel}#{msg.value.content.channel}{/if}
        </span>
        <MessageDropdown {msg} on:toggleRawMessage={toggleRawMessage} />
      </div>
    </div>
    <div slot="card-body">
      {#if !showRaw}
        <svelte:component this={selectedRenderer} {msg} {showRaw} />
      {:else}
        <MessageRaw {msg} />
      {/if}
    </div>
  </Card>
{:else}
  <Card {blured} border={privateMsgForYou} short={shortCard}>
    <div slot="card-header">
      <div class="columns">
        <div class="column col-3">
          <AvatarTile {feed} time={msg.value.timestamp} on:click={goProfile} />
        </div>
        <div class="column">
          <div class="ml-2 mr-2">
            <svelte:component this={selectedRenderer} {msg} {showRaw} />
          </div>
        </div>
        {#if msg.value.content.channel}
          <div class="column col-3 text-right">
            <span
              class="text-gray channel-display"
              on:click={() => {
                patchfox.go('hub', 'channel', {
                  channel: msg.value.content.channel
                });
              }}>
              #{msg.value.content.channel}
            </span>
            <MessageDropdown {msg} on:toggleRawMessage={toggleRawMessage} />
          </div>
        {/if}
      </div>
      <div slot="card-body">
        {#if showRaw}
          <MessageRaw {msg} />
        {/if}
      </div>
    </div>
  </Card>
{/if}
