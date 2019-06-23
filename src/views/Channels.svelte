<script>
  // NOTICE:
  // I've removed this view from the navigation.
  //
  // it is too slow, it takes about 60 seconds to query.
  //

  import { navigate } from "../utils.js";

  let activeChannels = [];
  let subscribedChannels = [];

  let loading = true;

  let pull = hermiebox.modules.pullStream;
  let sbot = hermiebox.sbot;

  const loadSubscribedChannels = () => {
    let query = {
      $filter: {
        value: {
          author: sbot.id,
          content: {
            type: "channel"
          }
        }
      },
      $sort: [["value", "timestamp"]]
    };
    pull(
      sbot.query.read({
        query: [query],
        live: true,
        reverse: true,
        limit: 500
      }),
      //pull.filter(c => {
      //  !subscribedChannels.some(sc => sc.channel == c.channel);
      //}),
      pull.drain(c => {
        if (c.sync) {
          console.log("finished loading");
          loading = false;
        } else {
          if (c.value.content.subscribed) {
            subscribedChannels.push(c.value.content.channel);
            subscribedChannels = subscribedChannels;
          }
        }
      })
    );
  };

  loadSubscribedChannels();
</script>

<style>
  .channel {
    cursor: pointer;
  }
</style>

<h4>Subscribed Channels</h4>

{#if subscribedChannels.length == 0}
  <div class="loading" />

  <p>This is a complex query, it might take a while... Channels will appear as we find them</p>
{:else}
  {#each subscribedChannels as c}
    <span
      class="channel label label-secondary m-1"
      on:click={() => navigate('/channel', { channel: c })}>
       #{c}
    </span>
  {/each}
{/if}
