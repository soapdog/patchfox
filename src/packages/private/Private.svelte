<script>
  export let msg

  let loading = true

  ssb.get(msg.key)
    .then(m => {
      msg = m
      loading = false
      console.dir(m)
    })
    .catch(e => {
      msg = {status: "error", error: e}
      loading = false 
    })

</script>

<div class="card-body">
{#if loading}
  <p>🔒 PRIVATE (decrypting...)</p>
{:else}
  {JSON.stringify(msg,null,4)}
{/if}
</div>
