<script>
  const MessageRenderer = require("../../core/components/MessageRenderer.svelte");
  let msgs = false;
  let error = false;
  export let thread;

  // todo: move back into using stores.
  $: {
    if (thread.startsWith("ssb:")) {
      thread = thread.replace("ssb:", "");
    }
    document.title = `Patchfox - Thread: ${thread}`;

    let promise = ssb
      .thread(thread)
      .then(ms => {
        msgs = ms;
        window.scrollTo(0, 0);
      })
      .catch(n => {
        console.dir(n);
        error = n.message;
        if (n.message.indexOf("stream is closed") !== -1) {
          location.reload();
        }
      });
  }
</script>

<div class="container">
  <h4>
    Thread
    <small class="label hide-sm">{thread}</small>
  </h4>
</div>
{#if error}
  <div class="toast toast-error">
    Couldn't load thread
    <a href="?thread={thread}#/thread">{thread}</a>
    : {error}
  </div>
{/if}
{#if !msgs && !error}
  <div class="loading loading-lg" />
{:else}
  {#each msgs as msg (msg.key)}
    <MessageRenderer {msg} />
  {/each}
{/if}
