<script>
  let loading = true;
  let status;

  ssb.system.getStatus()
    .then(data => { 
      console.log("data", data);
      loading = false;
      status = JSON.stringify(data, null, 4);
    });
</script>

<h1 class="title">Status</h1>
{#if loading}
  <div class="loading" />
{:else}
  <pre class="container">
    {@html status}
  </pre>
{/if}
