<script>
  const MessageRenderer = require("../../core/components/MessageRenderer.svelte")
  const { onDestroy } = require("svelte")

  let msgs = false
  let error = false
  let dropdownActive = false
  let promise

  export let lt = false
  export let limit = false

  $: {
    patchfox.title("Public")

    let opts = {}
    if (lt) {
      opts.lt = Number(lt)
      patchfox.title(`Public - ${lt}`)
    }

    console.time("public")
    promise = ssb
      .public(opts)
      .then(ms => {
        console.timeEnd("public")
        msgs = ms
        window.scrollTo(0, 0)
      })
      .catch(n => {
        throw n
      })
  }

  const goNext = () => {
    let lt = msgs[msgs.length - 1].value.timestamp
    msgs = false
    patchfox.go("hub", "public", { lt })
  }

  const urlForNext = () => {
    let lt = msgs[msgs.length - 1].value.timestamp
    return patchfox.url("hub", "public", { lt })
  }

  const goPrevious = () => {
    msgs = false
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


{#if error}
  <div class="toast toast-error">Error: {error}</div>
{/if}
{#await promise}
<div class="flex justify-center">
  <i class="fas fa-spinner fa-3x fa-spin" />
</div>
{:then}
  {#if msgs.length > 0}
    {#each msgs as msg (msg.key)}
      <MessageRenderer {msg} />
    {/each}
    <br>
    <div class="btn-group">
        <button class="btn btn-outline btn-wide" on:click={goPrevious}>Previous</button>
    
        <button class="btn btn-outline btn-wide" on:click={goNext}>Next</button>
    </div>
  {/if}
{/await}
