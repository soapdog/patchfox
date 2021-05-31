<script>
  let sbot = ssb.sbot;

  let joining = false;
  export let invite = "";
  let error = false;
  let msg = "";

  const joinPub = () => {
    error = false;
    msg = "";
    joining = true;
    sbot.invite.accept(invite, (err, result) => {
      joining = false;
      if (err) {
        error = true;
        msg = JSON.stringify(err, null, 4);
      } else {
        msg = JSON.stringify(result, null, 4);
      }
    });
  };
</script>

<style>
.hide-overflow {
  overflow: hidden;
}
</style>

<h1 class="title">Join Pub</h1>
<form on:submit|preventDefault={joinPub}>
  <div class="form-group">
    <label class="form-label" for="invite-code">Name</label>
    <input
      class="form-input"
      type="text"
      id="invite-code"
      placeholder="Invite code"
      bind:value={invite} />
  </div>
  <button class="btn btn-primary" class:loading={joining} disabled={joining} on:click={joinPub}>
    Join Pub
  </button>
</form>
{#if msg.length > 0}
  <div class="container">
    <div class="toast" class:toast-error={error}>
        <pre>{@html msg}</pre>
    </div>
  </div>
{/if}
