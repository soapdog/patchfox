<script>
  const GenericMsg = require("./GenericMsg.svelte");
  const AvatarChip = require("./AvatarChip.svelte");
  const MessageDropdown = require("./MessageDropdown.svelte");
  const { timestamp } = require("./timestamp.js");
  const { isMessageBlured } = require("../platforms/ssb/abusePrevention.js");
  const _ = require("lodash");

  export let msg;

  let type;
  let feed = msg.value.author;
  let showRaw = false;
  let rawContent = JSON.stringify(msg, null, 2);
  let dropdownActive = false;
  let privateMsgForYou = false;

  let messageTypes = [];

  let packagesForMessageTypes = _.filter(
    patchfox.packages,
    p => p.messageTypes
  );

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
      let validator = mt.validator || makeGenericValidatorForType(type);
      messageTypes.push({ type, validator, view });
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
      break;
    }
  }

  if (!selectedRenderer) {
    selectedRenderer = GenericMsg;
  }

  let image = "images/icon.png";
  let name = feed;
  let blured = isMessageBlured(msg);

  ssb.avatar(feed).then(data => {
    // console.log(`avatar for ${feed}`, data);
    if (data.image !== null) {
      image = patchfox.httpUrl(`/blobs/get/${data.image}`);
    }
    name = data.name;
  });

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

<div class="card m-2" class:private={privateMsgForYou} class:blured>
  <div class="card-header">
    <div class="float-left">
      <div class="card-title">
        <div class="tile tile-centered feed-display" on:click={goProfile}>
          <div class="tile-icon">
            <div class="example-tile-icon">
              <img src={image} class="avatar avatar-lg" alt={name} />
            </div>
          </div>
          <div class="tile-content">
            <div class="tile-title">{name}</div>
            <small class="tile-subtitle text-gray">
              {timestamp(msg.value.timestamp)}
            </small>
          </div>
        </div>
      </div>
    </div>
    {#if privateMsgForYou}
      <span class="label">PRIVATE</span>
    {/if}
    <div class="float-right">
      <span
        class="text-gray channel-display"
        on:click={() => {
          patchfox.go('hub', 'channel', { channel: msg.value.content.channel });
        }}>
        {#if msg.value.content.channel}#{msg.value.content.channel}{/if}
      </span>
      <MessageDropdown {msg} on:toggleRawMessage={toggleRawMessage} />
    </div>
  </div>
  {#if !showRaw}
    <svelte:component this={selectedRenderer} {msg} {showRaw} />
  {:else}
    <div class="card-body">
      <div class="columns">
        <div class="column col-9">
          <pre class="code">
            <code>{rawContent}</code>
          </pre>
        </div>
        <div class="column col-3">
          <p>
            This is a message of type
            <em>{type}</em>
            .
          </p>
          <p>
            To learn more about it, go to
            <a target="_blank" href="/docs/index.html#/message_types/{type}">
              the documentation about messages with type {type}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  {/if}
</div>
