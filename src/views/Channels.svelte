<script>
  // NOTICE: 
  // I've removed this view from the navigation.
  //
  // it is too slow, it takes about 60 seconds to query.
  // 
  let activeChannels = [];
  console.time("channels")
  let promise = ssb
    .channels()
    .then(channels => {
      console.timeEnd("channels", channels)
      activeChannels = channels
      })
    .catch(n => navigate("/error", { error: n }));
</script>

<h4>Active Channels</h4>
{#await promise}
  <div class="loading" />
{:then data}
  {#each activeChannels as c}
    <span class="label label-rounded badge m-2" data-badge={c.count}>
       {c.channel}
    </span>
  {/each}
{:catch err}
  <p>{err}</p>
{/await}
