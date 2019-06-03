<script>
  import MessageRenderer from "../messageTypes/MessageRenderer.svelte";

  let opts = {
    limit: 10,
    reverse: true
  };

  let msgs = false;
  let promise = ssb.public(opts).then(ms => (msgs = ms));

  const loadMore = ev => {
    ev.stopPropagation();
    ev.preventDefault();

    let lastMsg = msgs[msgs.length - 1];
    opts.lt = lastMsg.rts;
    promise = ssb.public(opts).then(ms => {
      msgs = ms;
      window.scrollTo(0, 0);
    });
    msgs = [];
  };
</script>

{#if !msgs}
  <p>Loading...</p>
{:else}
  {#each msgs as msg (msg.key)}
    <MessageRenderer {msg} />
  {/each}
  <ul class="pagination">
    <li class="page-item page-next">
      <a href="#/public" on:click={loadMore}>
        <div class="page-item-subtitle">Load More</div>
      </a>
    </li>
  </ul>
{/if}
