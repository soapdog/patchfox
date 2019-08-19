<script>
  const MessageRenderer = require("../messageTypes/MessageRenderer.svelte");
  const { navigate, routeParams } = require("../utils.js");
  const { getPrefs } = require("../prefs.js");
  const { onMount } = require("svelte");

  let msgs = false;
  let error = $routeParams.error || false;
  let dropdownActive = false;
  let promise;

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

    promise = ssb
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
    let lt = msgs[msgs.length - 1].value.timestamp;
    msgs = false;
    navigate("/public", {
      lt
    });
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
      <a href="#/public" on:click|stopPropagation|preventDefault={goNext}>
        <div class="page-item-subtitle">Next</div>
      </a>
    </li>
  </ul>
{/if}
{/await}
