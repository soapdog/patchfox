<script>
  import * as ssbUri from "ssb-uri2"

  let joining = false;
  export let invite = "";
  let error = false;
  let msg = "";

  patchfox.title("Join Rooms 2.0")

  const joinRoom = async () => {
    error = false;
    msg += `* Attempting to claim invite...\n`
    joining = true;
    
    try {
      let address = await ssb.rooms2.claimInvite(invite)
      msg += `* Attempting to connect to \`${address}\`...\n`
      let connectionAttempt = await ssb.rooms2.connectAndRemember(address)
      joining = false
      msg += `* Connected to room at \`${address}\`.\n\nDone! Welcome to the marvelous world of Rooms 2.0.`
    } catch(n) {
      error = true
      joining = false
      console.log("error connecting to room 2.0", n)

      if (n.message.indexOf("is already on the list") !== -1) {
        msg += `* Error: you already joined this room.\n`
      } else if (n.message.indexOf("item not found: invite") !== -1) {
        msg += `* Error: that invite code has already been used.\n`
      } else if (n.message) {
        msg += `* Error: ${n.message}.\n`
      } else {
        patchfox.go("errorHandler", {currentPackage: patchfox.packages["system"], error: n})
      }
    }
  };

  if (ssbUri.isExperimentalSSBURIWithAction("claim-http-invite")(invite)) {
    // loaded with room 2.0 invite
    joinRoom()
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

<h1 class="title">Joining Room 2.0</h1>
{#if msg.length > 0}
  <div class="container">
    <div class="content">
        <div>{@html ssb.markdown(msg)}</div>
        {#if joining}
        <div class="loading"></div>
        {/if}
    </div>
  </div>
{/if}
