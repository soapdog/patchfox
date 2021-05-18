<script>
  import * as  ssbUri  from"ssb-uri2"

  export let query;
  let loading = true;
  let hash;
  let msg;

  console.log("query", query);

  if (query.indexOf("ssb:invite/") != -1) {
    // it is an invite.
    msg = `Patchfox does not support invite URLs at the moment.`
    loading = false;
  } else {
    hash = ssbUri.toMessageSigil(query);
    console.log("hash", hash);

    if (hash[0] === "%") {
      patchfox.reload("hub", "thread", { thread: hash });
    }

    if (hash[0] === "@") {
      patchfox.reload("contacts", "profile", { feed: hash });
    }

    if (hash[0] === "#") {
      patchfox.reload("hub", "channel", { channel: hash.slice(1) });
    }

    if (hash[0] === "&") {
      window.location = `http://localhost:8989/blobs/get/${hash}`; // hack.
    }
  }
</script>

{#if loading}
  <div class="loading" />
{:else}
  <p>{msg}</p>
{/if}
