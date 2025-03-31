<script>
  const MenuItem = require("./ui/MenuItem.svelte")
  const { createEventDispatcher } = require("svelte")
  const ssbUri = require("ssb-uri2")


  export let msg
  export let showRaw = false

  let dropdownActive = false

  const dispatch = createEventDispatcher()

  const toggleRawMessage = () => {
    dispatch("toggleRawMessage")
  }

  const copyPermalink = () => {
    navigator.clipboard
      .writeText(ssbUri.fromMessageSigil(msg.key))
      .then(() => console.log("permalink copied"))
      .catch(err => console.error("can't copy permalink", err))

    dropdownActive = false
  }

  const copyHash = () => {
    navigator.clipboard
      .writeText(`${msg.key}`)
      .then(() => console.log("hash copied"))
      .catch(err => console.error("can't copy hash", err))

    dropdownActive = false
  }

  const openInNewTab = () => {
    dropdownActive = false
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

<div class="dropdown dropdown-end dropdown-hover">
  <span
    class="btn btn-ghost m-1"
    tabindex="0"
    class:active={dropdownActive}
    on:click={() => (dropdownActive = !dropdownActive)}>
    <i class="fas fa-ellipsis-v" />
  </span>
  <ul class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-80 z-40 text-sm font-extralight">
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

    <div class="divider">FOR THE CURIOUS</div>

    <MenuItem
      label="Raw Message"
      icon="message"
      on:click={toggleRawMessage} />

  </ul>
</div>
