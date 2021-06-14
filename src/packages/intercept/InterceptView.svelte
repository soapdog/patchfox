<script>
  import * as  ssbUri from "ssb-uri2"

  export let query;
  let loading = true;
  let hash;
  let msg;

  console.log("query", query);

  
  // Experimental handling
  if (ssbUri.isExperimentalSSBURI(query)) {

    if (ssbUri.isExperimentalSSBURIWithAction("claim-http-invite")(query)) {
      // SSB Room 2.0 invite.
      patchfox.reload("system", "joinRoom", {invite: query})
    }

    if (ssbUri.isExperimentalSSBURIWithAction("start-http-auth")(query)) {
      // SSB Room 2.0 http auth.
      throw "Can't handle Rooms 2.0 auth messages"
    }

  }
 
  if (ssbUri.isMessageSSBURI(query)) {
    let sigil = ssbUri.toMessageSigil(query)

    if (sigil[0] == "#") {
      patchfox.reload("hub", "channel", { channel: sigil.slice(1) });
    } else {
      patchfox.reload("hub", "thread", { thread: sigil })
    }
  }

  if (ssbUri.isFeedSSBURI(query)) {
    patchfox.reload("contacts", "profile", { feed: ssbUri.toMessageSigil(query) });
  }

  if (ssbUri.isBlobSSBURI(query)) {
    window.location = `http://localhost:8989/blobs/get/${ssbUri.toMessageSigil(query)}`; // fixme: assuming localhost:8989 for blob.
  }

</script>

{#if loading}
<div class="loading" />
{:else}
<p>{msg}</p>
{/if}
