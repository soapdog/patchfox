<script>
  const MessageDropdown = require("../MessageDropdown.svelte");
  const MessageRaw = require("../MessageRaw.svelte");
  const AvatarTile = require("../AvatarTile.svelte");
  const { isMessageBlured } = require("../../platforms/nodejs-ssb/abusePrevention.js");

  export let msg;
  export let showRaw = false;

  let feed = msg.value.author;
  let privateMsgForYou = false;

  let blur = false;
  let border = false;
  let dropdownActive = false;

  if (msg.value.private) {
    privateMsgForYou = true;
  }

  let blured = isMessageBlured(msg);

  const goProfile = ev => {
    if (ev.ctrlKey) {
      window.open(
        `?pkg=contacts&view=profile&feed=${encodeURIComponent(feed)}#/profile`
      );
    } else {
      patchfox.go("contacts", "profile", { feed });
    }
  };

  const toggleRawMessage = () => {
    showRaw = !showRaw;
    dropdownActive = false;
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

  .private {
    border: solid 2px orange;
  }

  .blur img {
    filter: blur(20px) !important;
  }

  .blur {
    border: solid 2px red;
  }

  .border {
    border: solid 2px orange;
  }
</style>

<div class="card m-2" class:blur class:border={privateMsgForYou}>
  <slot name="card-header">
    <div class="card-header">
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
  </slot>

  <div class="card-body">
    {#if !showRaw}
      <slot />
    {:else}
      <MessageRaw {msg} />
    {/if}
  </div>
  <slot name="card-footer" />
</div>
