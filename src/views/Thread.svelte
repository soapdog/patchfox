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
    console.log("fetching", msgid);
    let promise = ssb
      .thread(msgid)
      .then(ms => {
        console.log("messages arrived", ms);
        msgs = ms;
        window.scrollTo(0, 0);
      })
      .catch(n => {
        console.dir(n)
        error = n.message;
      });
  }
</script>

{#if error}
  <div class="toast toast-error">Couldn't load thead <a href="?thread={msgid}#/thread">{msgid}</a>: {error}</div>
{/if}
{#if !msgs && !error}
  <div class="loading loading-lg"></div>
{:else}
  {#each msgs as msg (msg.key)}
    <MessageRenderer {msg} />
  {/each}
{/if}
