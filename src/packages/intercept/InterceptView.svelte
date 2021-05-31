<script>
  import * as  ssbUri from "ssb-uri2"

  export let query;
  let loading = true;
  let hash;
  let msg;

  console.log("query", query);

  // ssb://experimental/?action=claim-http-invite&invite=3oHVSHpRPKuxykVWA-T2ZmleQHIojcu8DctXVPG6qx3Dy67wjJa-j1ABgvo0jPsvhWY%3D&postTo=https%3A%2F%2Fpicoroom.hendrikpeter.net%2Finvite%2Fconsume

  // ssb://experimental/?action=start-http-auth&multiserverAddress=net%3Apicoroom.hendrikpeter.net%3A8008~shs%3AckZbY7QH4oVp6pJm5jvm4jm%2BaO7qnrndacIhTZ6uDCo%3D&sc=29inDpT2jzNG7OfChOAGKD5BqogAV7JG4ZXWwERYZNw%3D&sid=%40ckZbY7QH4oVp6pJm5jvm4jm%2BaO7qnrndacIhTZ6uDCo%3D.ed25519
  
  // Experimental handling
  if (ssbUri.isExperimentalSSBURI(query)) {

    if (ssbUri.isExperimentalSSBURIWithAction("claim-http-invite")(query)) {
      // SSB Room 2.0 invite.
      patchfox.reload("system", "joinRoom", {invite: query})
    }

    if (ssbUri.isExperimentalSSBURIWithAction("start-http-auth")(query)) {
      // SSB Room 2.0 http auth.
      patchfox.reload("system", "httpAuth", {uri: query})
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
    window.location = `http://localhost:8989/blobs/get/${ssbUri.toMessageSigil(query)}`; // hack.
  }

</script>

{#if loading}
<div class="loading" />
{:else}
<p>{msg}</p>
{/if}
