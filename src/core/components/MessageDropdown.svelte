<script>
  const MenuItem = require("./ui/MenuItem.svelte");
  const { createEventDispatcher } = require("svelte");

  export let msg;
  export let showRaw = false;

  let dropdownActive = false;

  const dispatch = createEventDispatcher();

  const toggleRawMessage = () => {
    dispatch("toggleRawMessage");
  };

  const copyPermalink = () => {
    navigator.clipboard
      .writeText(ssbCustomUri.fromSigilLink(msg.key))
      .then(() => console.log("permalink copied"))
      .catch(err => console.error("can't copy permalink", err));

    dropdownActive = false;
  };

  const copyHash = () => {
    navigator.clipboard
      .writeText(`${msg.key}`)
      .then(() => console.log("hash copied"))
      .catch(err => console.error("can't copy hash", err));

    dropdownActive = false;
  };

  const openInNewTab = () => {
    dropdownActive = false;
    window.open(`/index.html?pkg=hub&view=thread&thread=${encodeURIComponent(msg.key)}`)
  }
</script>

<style>
  .menu-right {
    right: 0px !important;
    left: unset !important;
    min-width: 300px;
  }
</style>

<div class="dropdown">
  <span
    class="btn btn-link dropdown-toggle"
    tabindex="0"
    class:active={dropdownActive}
    on:click={() => (dropdownActive = !dropdownActive)}>
    <i class="icon icon-more-vert" />
  </span>
  <ul class="menu menu-right">
    <MenuItem
      label="Open In New Tab"
      icon="share"
      link="?pkg=hub&view=thread&thread={encodeURIComponent(msg.key)}"
      on:click={openInNewTab} />

    <MenuItem
      label="Copy permalink to clipboard"
      icon="copy"
      on:click={copyPermalink} />

    <MenuItem
      label="Copy message id to clipboard"
      icon="copy"
      on:click={copyHash} />

    <li class="divider" data-content="FOR THE CURIOUS" />

    <MenuItem
      label="Raw Message"
      icon="message"
      on:click={toggleRawMessage} />

  </ul>
</div>
