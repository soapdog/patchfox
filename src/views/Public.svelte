<script>
  import MessageRenderer from "../messageTypes/MessageRenderer.svelte";
  import { navigate, routeParams } from "../utils.js";
  let msgs = false;
  let error = $routeParams.error || false;

  // todo: move back into using stores.
  $: {
    let opts = {
      limit: 10,
      reverse: true
    };

    Object.assign(opts, $routeParams);
    console.dir("opts", opts);

    if (opts.hasOwnProperty("lt")) {
      opts.lt = parseInt(opts.lt);
    }

    let promise = ssb.public(opts).then(ms => {
      console.log("messages arrived", ms);
      msgs = ms;
      window.scrollTo(0, 0);
    }).catch(n => {
      if (!error) {
        navigate("/public", {error: n})
      }
    });
  }
</script>

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
            lt: msgs[msgs.length - 1].rts
          })}>
        <div class="page-item-subtitle">Next</div>
      </a>
    </li>
  </ul>
{/if}
