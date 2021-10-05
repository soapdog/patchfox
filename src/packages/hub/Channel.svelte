<script>
  const MessageRenderer = require("../../core/components/MessageRenderer.svelte")
  const {
    isChannelFiltered,
    addFilter,
    deleteFilter
  } = require("../../core/platforms/nodejs-ssb/abusePrevention.js")

  const { onMount, onDestroy } = require("svelte")

  let msgs = false
  let error = false
  let rootsOnly = false
  export let channel = false
  export let lt = false

  let subscribed = false
  let promise
  let hidden = isChannelFiltered(channel) || false

  if (!channel) {
    console.log("can't navigate to unnamed channel, going back to public")
    patchfox.go("hub") // force reload.
  }

  ssb.channelSubscribed(channel).then(s => (subscribed = s))

  $: {
    patchfox.title(`#${channel}`)

    let opts = {}
    if (lt) {
      opts.lt = lt
    }
    if (rootsOnly) {
      opts.rootsOnly = true
    } else {
      opts.rootsOnly = false
    }

    promise = ssb
      .channel(channel, opts)
      .then(ms => {
        msgs = ms
        window.scrollTo(0, 0)
      })
      .catch(n => {
        if (!error) {
          console.error("errrrooooor", n)
        }
      })
  }

  const subscriptionChanged = ev => {
    let v = ev.target.checked
    if (v) {
      ssb.channelSubscribe(channel).catch(() => (subscribed = false))
    } else {
      ssb.channelUnsubscribe(channel).catch(() => (subscribed = true))
    }
  }

  const hideChanged = ev => {
    let v = ev.target.checked
    if (v) {
      addFilter({
        action: "hide",
        channel
      })
    } else {
      deleteFilter({
        action: "hide",
        channel
      })
    }
    location.reload()
  }

  const rootsOnlyChanged = ev => {
    let v = ev.target.checked
    if (v) {
      // something
    } else {
      // other thing
    }
  }

  const goNext = () => {
    let lt = msgs[msgs.length - 1].value.timestamp
    msgs = []
    patchfox.go("hub", "channel", {
      channel,
      lt
    })
  }
  const goPrevious = () => {
    history.back()
  }
</script>

<style>
  .menu-right {
    right: 0px;
    left: unset;
    min-width: 300px;
  }
</style>

<div class="navbar mb-2 text-base-content">
    <div class="navbar-start">
      <button
        class="btn btn-sm"
        href="{patchfox.url("post", "compose",{channel})}"
        on:click|preventDefault={() => patchfox.go("post", "compose", {
            channel
          })}>
        New Post
      </button>
    </div>
    <div class="navbar-end">
      <div class="form-control">
      <label class="cursor-pointer label">
        <span class="label-text px-2">Hide Channel</span>
        <input type="checkbox" class="toggle" on:change={hideChanged} bind:checked={hidden} />
      </label>
      </div>

      <div class="form-control">
      <label class="cursor-pointer label">
        <span class="label-text px-2">Subscribe</span>
        <input
          type="checkbox"
          class="toggle"
          on:change={subscriptionChanged}
          bind:checked={subscribed} />
      </label>
    </div>
    <div class="form-control">
      <label class="cursor-pointer label">
        <span class="label-text px-2">Roots Only</span>
        <input
          class="toggle"
          type="checkbox"
          on:change={rootsOnlyChanged}
          bind:checked={rootsOnly} />
      </label>
    </div>
    </div>
</div>
{#if error}
  <div class="toast toast-error">Error: {error}</div>
{/if}
{#if isChannelFiltered(channel)}
  <p>This channel is being filtered.</p>
{:else}
  {#await promise}
    <div class="flex justify-center">
      <i class="fas fa-spinner fa-3x fa-spin" />
    </div>
  {:then}
    {#each msgs as msg (msg.key)}
      <MessageRenderer {msg} />
    {:else}
      <p>No messages.</p>
    {/each}
    <div class="btn-group">
        <button class="btn btn-outline btn-wide" on:click={goPrevious}>Previous</button>
    
        <button class="btn btn-outline btn-wide" on:click={goNext}>Next</button>
    </div>
  {/await}
{/if}
