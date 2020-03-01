<script>
  const MessageRenderer = require("../../core/components/MessageRenderer.svelte");
  const { onDestroy } = require("svelte");

  let msgs = false;
  let error = false;
  let dropdownActive = false;
  let promise;
  export let period = "week";
  export let page = 1;
  export let limit = false;

  $: {
    document.title = `Patchfox - Popular`;

    if (page) {
      document.title = `Patchfox - Popular - ${page}`;
    }

    console.time("popular");
    promise = ssb
      .popular({ period, page })
      .then(ms => {
        console.timeEnd("popular");
        console.log(`popular for ${period} msgs`, ms);
        msgs = ms;
        window.scrollTo(0, 0);
      })
      .catch(n => {
        throw n;
      });
  }

  const goNext = () => {
    let lt = msgs[msgs.length - 1].value.timestamp;
    msgs = false;
    patchfox.go("hub", "popular", { page: page + 1, period });
  };

  const urlForNext = () => {
    let lt = msgs[msgs.length - 1].value.timestamp;
    return patchfox.url("hub", "popular", { page: page + 1, period });
  };

  const goPrevious = () => {
    msgs = false;
    history.back();
  };
</script>

<style>
  .menu-right {
    right: 0px;
    left: unset;
    min-width: 300px;
  }
</style>

<div class="container">
  <div class="columns">
    <h4 class="column">Popular</h4>
    <div class="column">
      <div class="form-group">
        <label class="form-radio form-inline">
          <input type="radio" bind:group={period} name="period" value={"day"} />
          <i class="form-icon" />
          Day
        </label>
        <label class="form-radio form-inline">
          <input type="radio" bind:group={period} name="period" value={"week"} />
          <i class="form-icon" />
          Week
        </label>
        <label class="form-radio form-inline">
          <input type="radio" bind:group={period} name="period" value={"month"}/>
          <i class="form-icon" />
          Month
        </label>
        <label class="form-radio form-inline">
          <input type="radio" bind:group={period} name="period" value={"year"}/>
          <i class="form-icon" />
          Year
        </label>
      </div>
    </div>
  </div>
</div>
{#if error}
  <div class="toast toast-error">Error: {error}</div>
{/if}
{#await promise}
  <div class="loading loading-lg" />
{:then}
  {#if msgs.length > 0}
    {#each msgs as msg (msg.key)}
      <MessageRenderer {msg} />
    {/each}
    <ul class="pagination">
      <li class="page-item page-previous">
        <a href="#/public" on:click|stopPropagation|preventDefault={goPrevious}>
          <div class="page-item-subtitle">Previous</div>
        </a>
      </li>
      <li class="page-item page-next">
        <a href={urlForNext()} on:click|stopPropagation|preventDefault={goNext}>
          <div class="page-item-subtitle">Next</div>
        </a>
      </li>
    </ul>
  {/if}
{/await}
