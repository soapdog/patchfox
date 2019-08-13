<script>
  const MessageRenderer = require("../messageTypes/MessageRenderer.svelte");
  const { navigate, routeParams } = require("../utils.js");
  const { getPrefs } = require("../prefs.js");
  const { onMount } = require("svelte");

  let msgs = false;
  let error = $routeParams.error || false;
  let dropdownActive = false;

  let opts = {};

  // todo: move back into using stores.
  $: {
    Object.assign(opts, $routeParams);

    document.title = `Patchfox - Public`;

    if (opts.hasOwnProperty("lt")) {
      opts.lt = parseInt(opts.lt);
    }

    if (opts.hasOwnProperty("limit")) {
      opts.limit = parseInt(opts.limit);
    }

    let promise = ssb
      .public(opts)
      .then(ms => {
        msgs = ms;
        window.scrollTo(0, 0);
      })
      .catch(n => {
        if (!error) {
          console.error("errrrooooor", n);
        }
      });
  }

  const goNext = () => {
    navigate("/public", {
      lt: msgs[msgs.length - 1].value.timestamp
    });
  };
  const goPrevious = () => {
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
{#if !msgs}
  <div class="loading loading-lg" />
{:else}
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
      <a href="#/public" on:click|stopPropagation|preventDefault={goNext}>
        <div class="page-item-subtitle">Next</div>
      </a>
    </li>
  </ul>
{/if}
