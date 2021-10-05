<script>
  const MessageRenderer = require("../../core/components/MessageRenderer.svelte")
  const { onDestroy } = require("svelte")

  let msgs = false
  let error = false
  let dropdownActive = false
  let promise
  export let period = "week"
  export let page = 1
  export let limit = false

  $: {
    if (page) {
      patchfox.title(`Page: ${page}`)
    }

    console.time("popular")
    promise = ssb
      .popular({ period, page })
      .then(ms => {
        console.timeEnd("popular")
        console.log(`popular for ${period} msgs`, ms)
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
    patchfox.go("hub", "popular", { page: page + 1, period })
  }

  const urlForNext = () => {
    let lt = msgs[msgs.length - 1].value.timestamp
    return patchfox.url("hub", "popular", { page: page + 1, period })
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

<div class="container">
  <div class="btn-group">
    <input type="radio" bind:group={period} name="period" value={"day"} data-title="Day" class="btn btn-outline btn-xs" class:btn-active={period == "day"} /> 
    <input type="radio" bind:group={period} name="period" value={"week"} data-title="Week" class="btn btn-outline btn-xs" class:btn-active={period == "week"} /> 
    <input type="radio" bind:group={period} name="period" value={"month"} data-title="Month" class="btn btn-outline btn-xs" class:btn-active={period == "month"} /> 
    <input type="radio" bind:group={period} name="period" value={"year"} data-title="Year" class="btn btn-outline btn-xs" class:btn-active={period == "year"} />
  </div>
</div>
{#if error}
<div class="toast toast-error">Error: {error}</div>
{/if} 
<br>
{#await promise}
<div class="flex justify-center">
  <i class="fas fa-spinner fa-3x fa-spin" />
</div>
{:then} {#if msgs.length > 0} 
{#each msgs as msg (msg.key)}
<MessageRenderer {msg} />
{/each}
<div class="btn-group">
    <button class="btn btn-outline btn-wide" on:click={goPrevious}>Previous</button>

    <button class="btn btn-outline btn-wide" on:click={goNext}>Next</button>
</div>
{/if} 
{/await}
