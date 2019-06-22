<script>
  // NOTICE:
  // I've removed this view from the navigation.
  //
  // it is too slow, it takes about 60 seconds to query.
  //

  import { navigate } from "../utils.js";


  let activeChannels = [];
  let subscribedChannels = [];

  console.time("channels");
  let acPromise = ssb
    .channels()
    .then(channels => {
      console.timeEnd("channels", channels);
      activeChannels = channels;
    })
    .catch(n => navigate("/error", { error: n }));

  let scPromise = ssb
    .subscribedChannels()
    .then(channels => {
      console.log("channels for feed", channels);
      subscribedChannels = channels;
    })
    .catch(n => navigate("/error", { error: n }));
</script>

<h4>Subscribed Channels</h4>
{#await scPromise}
  <div class="loading" />
  <p>This is a complex query, it might take a while...</p>
{:then data}
  {#each subscribedChannels as c}
    <span
      class="label label-rounded badge m-2"
      data-badge={c.count}
      on:click={() => navigate('/channel', { channel: c.channel })}>
       {c.channel}
    </span>
  {/each}
{:catch err}
  <p>{err}</p>
{/await}
<h4>Active Channels</h4>
{#await acPromise}
  <div class="loading" />
  <p>This is a complex query, it might take a while...</p>
{:then data}
  {#each activeChannels as c}
    <span
      class="label label-rounded badge m-2"
      data-badge={c.count}
      on:click={() => navigate('/channel', { channel: c.channel })}>
       {c.channel}
    </span>
  {/each}
{:catch err}
  <p>{err}</p>
{/await}
