<script>
  const { tick } = require("svelte");
  const MessageRenderer = require("../messageTypes/MessageRenderer.svelte");
  const { navigate, routeParams } = require("../utils.js");
  let msgs = [];
  let loading = true;
  let error = false;
  let query;

  $: {
    if (query !== $routeParams.query) {
      query = $routeParams.query;
      msgs = [];
      loading = true;
      console.log("New search", query);
    }

    document.title = `Patchfox - search: ${query}`;

    const gotResult = async msg => {
      await tick();
      console.log("got a match", msg);
      msgs.push(msg);
    };

    let promise = ssb
      .searchWithCallback(query, gotResult)
      .then(() => {
        loading = false;
      })
      .catch(n => {
        console.dir(n);
        error = n.message;
        loading = false;
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
{#if loading}
  <div class="loading loading-lg" />
{/if}
{#each msgs as msg (msg.key)}
  <MessageRenderer {msg} />
{/each}
