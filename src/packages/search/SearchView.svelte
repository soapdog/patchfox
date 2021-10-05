<script>
  const { tick } = require("svelte")
  const MessageRenderer = require("../../core/components/MessageRenderer.svelte")
  const Spinner = require("../../core/components/Spinner.svelte")
  let msgs = []
  let error = false
  export let query
  let promise

  $: {
    document.title = `Patchfox - search: ${query}`

    console.log("searching for", query)

    const gotResult = msg => {
      console.log("got a match", msg)
      msgs.push(msg)
      msgs = msgs
      return true
    }

    if (query[0] === "%") {
      patchfox.reload("hub", "thread", { thread: query })
    }

    if (query[0] === "@") {
      patchfox.reload("contacts", "profile", { feed: query })
    }

    if (query[0] === "#") {
      patchfox.reload("hub", "channel", { channel: query.slice(1) })
    }

    if (query[0] === "&") {
      window.location = patchfox.blobUrl(query)
    }

    promise = ssb
      .searchWithCallback(query, gotResult)
      .then(() => {
        console.log("finished searching", msgs)
      })
      .catch(n => {
        console.dir("error searching", n)
        error = n.message
      })
  }
</script>

<div class="container">
  <h4>
    Search
    <small class="label hide-sm">{query}</small>
  </h4>
</div>
{#if error}
  <div class="alert alert-error">
    <span class="flex-1">Couldn't find results for query {query} : {error}</span>
  </div>
{/if}
{#await promise}
  <Spinner />
{:then}

{/await}
{#each msgs as msg (msg.key)}
  <MessageRenderer {msg} />
{/each}
