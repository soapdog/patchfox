<script>
  import MessageRenderer from "../messageTypes/MessageRenderer.svelte";
  import { navigate, routeParams } from "../utils.js";
  let msgs = false;
  let error = $routeParams.error || false;
  let dropdownActive = false;

  let opts = {
    limit: $routeParams.limit || 10,
    reverse: true
  };

  let onlyRoots = $routeParams.onlyRoots || false;

  // todo: move back into using stores.
  $: {
    Object.assign(opts, $routeParams);

    if (opts.hasOwnProperty("lt")) {
      opts.lt = parseInt(opts.lt);
    }

    if (opts.hasOwnProperty("limit")) {
      opts.limit = parseInt(opts.limit);
    }

    let promise = ssb
      .public(opts, { onlyRoots })
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
    <div class="column">
      <div class="dropdown float-right">
        <span
          class="btn btn-link dropdown-toggle"
          tabindex="0"
          class:active={dropdownActive}
          on:click={() => (dropdownActive = !dropdownActive)}>
          <i class="icon icon-more-horiz text-gray" />
        </span>
        <ul class="menu menu-right">
          <li class="menu-item">
            <label class="form-checkbox">
              <input type="checkbox" bind:checked={onlyRoots} />
              <i class="form-icon" />
              Show Only Roots
            </label>
          </li>
          <li class="menu-item">
            <label class="form-label" for="input-example-1">
              Fetch {opts.limit} messages
            </label>
            <input
              class="slider tooltip"
              bind:value={opts.limit}
              type="range"
              min="10"
              max="100"
              value="50" />
          </li>

        </ul>
      </div>
    </div>
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
      <a
        href="#/public"
        on:click|stopPropagation|preventDefault={() => history.back()}>
        <div class="page-item-subtitle">Previous</div>
      </a>
    </li>
    <li class="page-item page-next">
      <a
        href="#/public"
        on:click|stopPropagation|preventDefault={() => navigate('/public', {
            lt: msgs[msgs.length - 1].rts,
            limit: opts.limit,
            onlyRoots: opts.onlyRoots
          })}>
        <div class="page-item-subtitle">Next</div>
      </a>
    </li>
  </ul>
{/if}
