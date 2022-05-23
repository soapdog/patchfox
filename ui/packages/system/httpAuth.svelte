<script>
  import * as ssbUri from "ssb-uri2"

  let busy = false;
  export let uri = "";
  let error = false;
  let msg = "";

  const startAuthenticationDance = async () => {
    error = false;
    msg += `* Attempting to authenticate...\n`
    busy = true;
    
    try {
      let data = await ssb.rooms2.authenticateWithURI(uri)
      console.log("data", data)
    } catch(n) {
      error = true
      busy = false
      console.log("error", n)
    }
  };

  if (ssbUri.isExperimentalSSBURIWithAction("start-http-auth")(uri)) {
    // loaded with room 2.0 invite
    startAuthenticationDance()
  }
</script>

<style>
.hide-overflow {
  overflow: hidden;
}

.code {
    border-radius: 5px; 
    border: 1px solid #BCBEC0;
    padding: 2px;
    font:12px Monaco,Consolas,"Andale  Mono","DejaVu Sans Mono",monospace
}
</style>

<h1 class="title">Authenting SSB with HTTP...</h1>
{#if msg.length > 0}
  <div class="container">
    <div class="content">
        <div>{@html ssb.markdown(msg)}</div>
        {#if busy}
        <div class="loading"></div>
        {/if}
    </div>
  </div>
{/if}
