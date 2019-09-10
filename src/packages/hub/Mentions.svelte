<script>
  const MessageRenderer = require("../../core/components/messageTypes/MessageRenderer.svelte");
  const pull = require("pull-stream");

  let msgs = [];
  let unsub;

  document.title = `Patchfox - Mentions`;

  let lt = false;

  const loadMentions = () => {
    console.log("Loading mentions...", lt);
    window.scrollTo(0, 0);
    msgs = [];
    ssb.mentions(ssb.feed, lt).then(ms => (msgs = ms));
  };

  loadMentions();
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
        href="#/public"
        on:click|stopPropagation|preventDefault={() => {
          navigate('/mentions', { lt: msgs[msgs.length - 1].rts });
        }}>
        <div class="page-item-subtitle">Next</div>
      </a>
    </li>
  </ul>
{/if}
