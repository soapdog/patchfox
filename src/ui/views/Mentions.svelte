<script>
  const MessageRenderer = require("../messageTypes/MessageRenderer.svelte");
  const { navigate, routeParams } = require("../utils.js");
  const { getPref } = require("../prefs.js");
  const { onDestroy, onMount } = require("svelte");

  let msgs = [];
  let unsub;

  document.title = `Patchfox - Mentions`;

  let lt = false;

  const pull = hermiebox.modules.pullStream;
  const sbot = hermiebox.sbot;

  const loadMentions = () => {
    console.log("Loading mentions...", lt);
    window.scrollTo(0, 0);
    msgs = [];
    ssb.mentions(ssb.feed, lt).then(ms => (msgs = ms));
  };

  onDestroy(() => {
    unsub();
  });

  onMount(() => {
    unsub = routeParams.subscribe(params => {
      console.log("params changed.", lt, params.lt);
      if (params.lt) {
        let newlt = parseInt(params.lt);
        if (newlt !== lt) {
          lt = newlt;
        }
      } else {
        lt = false;
      }
      loadMentions();
    });
  });
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
