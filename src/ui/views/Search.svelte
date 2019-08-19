<script>
  const { tick } = require("svelte");
  const MessageRenderer = require("../messageTypes/MessageRenderer.svelte");
  const { navigate, routeParams } = require("../utils.js");
  let msgs = [];
  let error = false;
  let query;
  let promise;

  $: {
    if (query !== $routeParams.query) {
      query = $routeParams.query;
      msgs = [];
      console.log("New search", query);
    }

    document.title = `Patchfox - search: ${query}`;

    const gotResult = async msg => {
      console.log("got a match", msg);
      msgs.push(msg);
      await tick();
      return true;
    };

    promise = ssb
      .searchWithCallback(query, gotResult)
      .then(() => {
      })
      .catch(n => {
        console.dir(n);
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
{/await}
{#each msgs as msg (msg.key)}
  <MessageRenderer {msg} />
{/each}
