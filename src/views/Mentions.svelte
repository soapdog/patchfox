<script>
  import MessageRenderer from "../messageTypes/MessageRenderer.svelte";
  import { navigate, routeParams, getPref } from "../utils.js";
  import { onDestroy, onMount } from "svelte";

  let msgs = [];
  let unsub;

  document.title = `Patchfox - Mentions`;

  let lt = false;

  const pull = hermiebox.modules.pullStream;
  const sbot = hermiebox.sbot;
  const createBacklinkStream = id => {
    var filterQuery = {
      $filter: {
        dest: id
      }
    };

    if (lt) {
      filterQuery.$filter.value = { timestamp: { $lt: lt } };
    }

    return sbot.backlinks.read({
      query: [filterQuery],
      index: "DTA", // use asserted timestamps
      live: true,
      reverse: true,
      limit: getPref("limit", "10")
    });
  };

  const uniqueRoots = msg => {
    return pull.filter(msg => {
      let msgKey = msg.key;
      if (msg.value.content.type !== "post") {
        return true;
      }
      let rootKey = msg.value.content.root || false;
      if (rootKey) {
        if (msgs.some(m => m.value.content.root === rootKey)) {
          return false;
        }
      }
      return true;
    });
  };

  const mentionUser = msg => {
    return pull.filter(msg => {
      if (msg.value.content.type !== "post") {
        return true;
      }
      let mentions = msg.value.content.mentions || [];
      if (mentions.some(m => m.link == sbot.id)) {
        return true;
      }
      return false;
    });
  };

  const loadMentions = () => {
    console.log("Loading mentions...", lt);
    window.scrollTo(0,0)
    msgs = []
    pull(
      createBacklinkStream(sbot.id),
      pull.filter(msg => !msg.sync),
      // note the 'live' style streams emit { sync: true } when they're up to date!
      uniqueRoots(),
      mentionUser(),
      pull.drain(msg => {
        msgs.push(msg);
        msgs = msgs;
      })
    );
  };

  onDestroy(() => {
    unsub();
  });

  onMount(() => {
    unsub = routeParams.subscribe(params => {
      console.log("params changed.", lt, params.lt)
      if (params.lt) {
        let newlt = parseInt(params.lt);
        if (newlt !== lt) {
          lt = newlt;
        }
      } else {
        lt = false
      }
      loadMentions();
    });
  });
</script>

<style>
  .menu-right {
    right: 0px;
    left: unset;
    min-width: 300px;
  }
</style>

<div class="container">
  <div class="columns">
    <h4 class="column">Mentions</h4>
    <div class="column" />
  </div>
</div>
{#if msgs.length === 0}
  <div class="loading loading-lg" />
{:else}
  {#each msgs as msg (msg.key)}
    <MessageRenderer {msg} />
  {/each}
  <ul class="pagination">
    <li class="page-item page-previous">
      <a
        href="#/public"
        on:click|stopPropagation|preventDefault={() => history.back()}>
        <div class="page-item-subtitle">Previous</div>
      </a>
    </li>
    <li class="page-item page-next">
      <a
        href="#/public"
        on:click|stopPropagation|preventDefault={() => {
          navigate('/mentions', { lt:  msgs[msgs.length - 1].rts });
        }}>
        <div class="page-item-subtitle">Next</div>
      </a>
    </li>
  </ul>
{/if}
