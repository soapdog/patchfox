<script>
  const MessageRenderer = require("../../core/components/MessageRenderer.svelte");
  const { onDestroy } = require("svelte");

  let msgs = false;
  let error = false;
  let dropdownActive = false;
  let promise;

  export let lt = false;
  export let limit = false;

  $: {
    document.title = `Patchfox - Popular`;

    let opts = {};
    if (lt) {
      opts.lt = Number(lt);
      document.title = `Patchfox - Popular - ${lt}`;
    }

    console.time("popular");
    promise = ssb
      .popular({period: "week"})
      .then(ms => {
        console.timeEnd("popular");
        console.log("got msgs", ms);
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
    patchfox.go("hub", "public", { lt });
  };

  const urlForNext = () => {
    let lt = msgs[msgs.length - 1].value.timestamp;
    return patchfox.url("hub", "public", { lt });
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
    <h4 class="column">Public Feed</h4>
    <div class="column" />
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
