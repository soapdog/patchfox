<script>
  let loading = true
  let peerlist = []

  ssb.system.getPeers()
    .then(data => {
      console.log("data", data)
      loading = false
      peerlist = data
    })
    .catch(err => {
      throw err
    })
</script>

<h1 class="title">Peer list</h1>
{#if loading}
  <div class="loading" />
{:else}
  <table class="table table-stripped table-scroll">
    <thead>
      <tr>
        <th>Host</th>
        <th>Port</th>
        <th>Key</th>
      </tr>
    </thead>
    <tbody>
      {#each peerlist as peer}
        <tr>
          <td>{peer.host}</td>
          <td>{peer.port}</td>
          <td>
            <a
              href={patchfox.url("contacts", "profile", { feed: peer.key })}
              on:click|preventDefault={() => patchfox.go(
                  "contacts",
                  "profile",
                  { feed: peer.key }
                )}>
              {peer.key}
            </a>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
