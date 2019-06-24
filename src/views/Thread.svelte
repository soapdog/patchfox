<script>
  import MessageRenderer from "../messageTypes/MessageRenderer.svelte";
  import { navigate, routeParams } from "../utils.js";
  let msgs = false;
  let error = false;
  let msgid;

  // todo: move back into using stores.
  $: {
    msgid = $routeParams.thread;
    if (msgid.startsWith("ssb:")) {
      msgid = msgid.replace("ssb:", "");
    }
    document.title = `Patchfox - Thread: ${msgid}`;

    let promise = ssb
      .thread(msgid)
      .then(ms => {
        msgs = ms;
        window.scrollTo(0, 0);
      })
      .catch(n => {
        console.dir(n);
        error = n.message;
      });
  }

</script>

<div class="container">
  <h4>
    Thread
    <small class="label hide-sm">{msgid}</small>
  </h4>
</div>
{#if error}
  <div class="toast toast-error">
    Couldn't load thead
    <a href="?thread={msgid}#/thread">{msgid}</a>
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
