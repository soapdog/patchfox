<script>
  import MessageRenderer from "../messageTypes/MessageRenderer.svelte";
  import { navigate, routeParams } from "../utils.js";
  let msgs = false;
  let error = $routeParams.error || false;
  let channel = $routeParams.channel || false;
  let subscribed = false;

  if (!channel) {
    console.log("can't navigate to unnamed channel, going back to public");
    location = "index.html#/public"; // force reload.
  }

  let opts = {
    limit: $routeParams.limit || 10,
    reverse: true
  };

  ssb.channelSubscribed(channel)
    .then(s => subscribed = s)

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
      .channel(channel, opts)
      .then(ms => {
        console.log("msg", ms);
        msgs = ms;
        window.scrollTo(0, 0);
      })
      .catch(n => {
        if (!error) {
          console.error("errrrooooor", n);
        }
      });
  }

  const subscriptionChanged = ev => {
    let v = ev.target.checked;
    if (v) {
      ssb
        .channelSubscribe(channel)
        .catch(() => (subscribed = false));
    } else {
      ssb
        .channelUnsubscribe(channel)
        .catch(() => (subscribed = true));
    }
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
    <h4 class="column">Channel: #{channel}</h4>
    <div class="column">
      <label class="form-switch float-right">
        <input type="checkbox" on:change={subscriptionChanged} bind:checked={subscribed} />
        <i class="form-icon" />
        Subscribe
      </label>
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
        on:click|stopPropagation|preventDefault={() => navigate('/channel', {
            channel,
            lt: msgs[msgs.length - 1].rts,
            limit: opts.limit,
            onlyRoots: opts.onlyRoots
          })}>
        <div class="page-item-subtitle">Next</div>
      </a>
    </li>
  </ul>
{/if}
