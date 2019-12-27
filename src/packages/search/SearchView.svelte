<script>
  const { tick } = require("svelte");
  const MessageRenderer = require("../../core/components/MessageRenderer.svelte");
  let msgs = [];
  let error = false;
  export let query;
  let promise;

  $: {
    document.title = `Patchfox - search: ${query}`;

    console.log("searching for", query);

    const gotResult = msg => {
      console.log("got a match", msg);
      msgs.push(msg);
      msgs = msgs;
      return true;
    };

    if (query[0] === "%") {
      patchfox.reload("hub", "thread", { thread: query });
    }

    if (query[0] === "@") {
      patchfox.reload("contacts", "profile", { feed: query });
    }

     if (query[0] === "#") {
      patchfox.reload("hub", "channel", { channel: query.slice(1) });
    }

    promise = ssb
      .searchWithCallback(query, gotResult)
      .then(() => {
        console.log("finished searching", msgs);
      })
      .catch(n => {
        console.dir("error searching", n);
        error = n.message;
      });
  }
</script>

<div class="container">
  <h4>
    Search
    <small class="label hide-sm">{query}</small>
  </h4>
</div>
{#if error}
  <div class="toast toast-error">
    Couldn't find results for query {query} : {error}
  </div>
{/if}
{#await promise}
  <div class="loading loading-lg" />
{:then}

{/await}
{#each msgs as msg (msg.key)}
  <MessageRenderer {msg} />
{/each}
