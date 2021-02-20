<script>
  let sbot = ssb.sbot;

  let loading = true;
  let status;

  sbot.status((err, data) => {
    console.log("data", data);
    console.log("err", err);
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
