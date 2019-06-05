<script>
  import MessageRenderer from "../messageTypes/MessageRenderer.svelte";
  import { navigate, routeParams } from "../utils.js";
  let msgs = false;

  // todo: move back into using stores.
  $: {
    let msgid = $routeParams.thread;
    console.log("fetching", msgid);
    let promise = ssb.thread(msgid).then(ms => {
      console.log("messages arrived", ms);
      msgs = ms;
      window.scrollTo(0, 0);
    });
  }
</script>

{#if !msgs}
  <p>Loading...</p>
{:else}
  {#each msgs as msg (msg.key)}
    <MessageRenderer {msg} />
  {/each}
{/if}
