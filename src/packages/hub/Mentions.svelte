<script>
  const MessageRenderer = require("../../core/components/MessageRenderer.svelte");
  const pull = require("pull-stream");

  let msgs = [];
  let unsub;

  document.title = `Patchfox - Mentions`;

  export let lt = false;

  $: {
    console.log("Loading mentions...", lt);
    window.scrollTo(0, 0);
    msgs = [];
    ssb
      .mentions(ssb.feed, Number(lt))
      .then(ms => (msgs = ms))
      .catch(n =>
        patchfox.go("errorHandler", {
          error: n
        })
      );
  }

  
  const urlForNext = () => {
    let lt = msgs[msgs.length - 1].value.timestamp;
    return patchfox.url("hub", "public", { lt });
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
    <h4 class="column">Mentions</h4>
    <div class="column" />
  </div>
</div>
{#if msgs.length === 0}
  <div class="loading loading-lg" />
{:else}
  {#each msgs as msg (msg.key)}
    <MessageRenderer {msg} />
  {/each}
  <ul class="pagination">
    <li class="page-item page-previous">
      <a
        href="#/public"
        on:click|stopPropagation|preventDefault={() => history.back()}>
        <div class="page-item-subtitle">Previous</div>
      </a>
    </li>
    <li class="page-item page-next">
      <a
        href="{urlForNext()}"
        on:click|stopPropagation|preventDefault={() => {
          let newLt = msgs[msgs.length - 1].timestamp;
          patchfox.go('hub', 'mentions', { lt: newLt });
        }}>
        <div class="page-item-subtitle">Next</div>
      </a>
    </li>
  </ul>
{/if}
