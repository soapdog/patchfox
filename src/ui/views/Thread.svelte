<script>
  const MessageRenderer = require("../messageTypes/MessageRenderer.svelte");
  const { navigate, routeParams } = require("../utils.js");
  let msgs = false;
  let error = false;
  let msgid;

  console.log("hooks");
  window._SCHEME_HOOKS = {
    messages: {
      name: "messages",
      description: "The messages loaded on the current thread",
      minArguments: 0,
      maxArguments: 0,
      action: function() {
        return msgs;
      }
    },
    keys: {
      name: "keys",
      description: "A list with the keys of the loaded messages",
      minArguments: 0,
      maxArguments: 0,
      action: function() {
        return msgs.map(m => m.key);
      }
    }
  };

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
