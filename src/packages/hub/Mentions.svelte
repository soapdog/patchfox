<script>
  const MessageRenderer = require("../../core/components/MessageRenderer.svelte")
  const pull = require("pull-stream")

  let msgs = []
  let loading = true
  let unsub

  export let lt = false

  $: {
    console.log("Loading mentions...", lt)
    window.scrollTo(0, 0)
    msgs = []
    ssb
      .mentions(ssb.feed, Number(lt))
      .then(ms => {
        loading = false
        msgs = ms
      })
      .catch(n =>
        patchfox.go("errorHandler", {
          error: n
        })
      )
  }

  
  const urlForNext = () => {
    let lt = msgs[msgs.length - 1].value.timestamp
    return patchfox.url("hub", "public", { lt })
  }
</script>

{#if loading}
<div class="flex justify-center">
  <i class="fas fa-spinner fa-3x fa-spin" />
</div>
{:else}
  {#each msgs as msg (msg.key)}
    <MessageRenderer {msg} />
  {/each}
  <div class="btn-group">
      <button
        class="btn btn-outline btn-wide"
        on:click|stopPropagation|preventDefault={() => history.back()}>
        Previous
      </button>
      <button
        class="btn btn-outline btn-wide"
        on:click|stopPropagation|preventDefault={() => {
          let newLt = msgs[msgs.length - 1].timestamp
          patchfox.go("hub", "mentions", { lt: newLt })
        }}>
        Next
      </button>
  </div>
{/if}
