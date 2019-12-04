<script>
  const pull = require("pull-stream");
  const paramap = require("pull-paramap");
  const sort = require("pull-sort");
  const { onDestroy, tick } = require("svelte");
  const { timestamp } = require("../../core/components/parts/timestamp.js");

  export let filter = "everyone";
  export let channel = false;
  let sbot = ssb.sbot;
  let content = [];
  let channels = [];
  let limit = 20;


  let opts = {};

  const subscribedChannels = () => {
    pull(
      sbot.query.read({
        reverse: true,
        query: [
          {
            $filter: {
              value: {
                author: sbot.id,
                content: { type: "channel" }
              }
            }
          },
          { $map: ["value", "content"] }
        ]
      }),
      pull.unique("channel"),
      pull.filter("subscribed"),
      pull.map("channel"),
      pull.collect((e, c) => {
        channels = c;
        channel = channel || channels[0];
        getContentForChannel(channel);
      })
    );
  };

  const getContentForChannel = c => {
    content = [];
    channel = c;
    let query = [
      {
        $filter: {
          value: {
            content: {
              channel: c,
              type: { $in: ["post", "blog"] }
            }
          }
        }
      }
    ];

    pull(
      sbot.query.read({
        query,
        reverse: true
      }),
      ssb.filterWithUserFilters(),
      pull.filter(msg => {
        if (msg.value.content.type === "post") {
          let root = msg.value.content.root;
          let branch = msg.value.content.branch;

          if (branch) return false;
          if (root && root !== msg.key) return false;
        }
        return true;
      }),
      pull.take(limit),
      pull.drain(function(data) {
        content.push(data);
        content = content;
      })
    );
  };

  subscribedChannels();
</script>

<style>
  /* Box-sizing reset: //w3bits.com/?p=3225 */

  :global(body) {
    background: unset;
    background-color: whitesmoke;
  }

  .zine {
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  /* The Masonry Container */
  .masonry {
    margin: 0.5em auto;
    column-gap: 0;
  }

  /* The Masonry Brick */
  .item {
    padding: 1em;
    margin: 0 0 0;
  }

  /* Masonry on large screens */
  @media only screen and (min-width: 1024px) {
    .masonry {
      column-count: 4;
    }
  }

  /* Masonry on medium-sized screens */
  @media only screen and (max-width: 1023px) and (min-width: 768px) {
    .masonry {
      column-count: 3;
    }
  }

  /* Masonry on small screens */
  @media only screen and (max-width: 767px) and (min-width: 540px) {
    .masonry {
      column-count: 2;
    }
  }
</style>

<div class="container">
  <!-- <span>Show content from</span>
  <div class="btn-group">
    <button
      class="btn"
      class:btn-primary={filter == 'everyone'}
      on:click={() => (filter = 'everyone')}>
      Everyone
    </button>
    <button
      class="btn"
      class:btn-primary={filter == 'friends'}
      on:click={() => (filter = 'friends')}>
      Friends
    </button>
    <button
      class="btn"
      class:btn-primary={filter == 'followers'}
      on:click={() => (filter = 'followers')}>
      People you follow
    </button>
  </div> -->

  <div class="dropdown">
    <a href="#" class="btn btn-link dropdown-toggle" tabindex="0">
      {channel}
      <i class="icon icon-caret" />
    </a>
    <!-- menu component -->
    <ul class="menu">
      {#each channels as c}
        <li class="menu-item">
          <a on:click|preventDefault={() => getContentForChannel(c)} href="#">
            {c}
          </a>
        </li>
      {/each}
    </ul>
  </div>
</div>

<div class="zine">
  {#if content.length == 0}
    <div class="loading" />
  {:else}
    <div class="masonry">
      {#each content as msg}
        <div class="item">
          {#if msg.value.content.type === 'post'}
            <div class="card">
              <div class="card-body">
                {@html ssb.markdown(msg.value.content.text).slice(0, 500)}
              </div>
              <div class="card-footer">
                <span class="float-left">{timestamp(msg.value.timestamp)}</span>
                <a
                  href={patchfox.url('hub', 'thread', { thread: msg.key })}
                  class="btn btn-link float-right">
                  &rarr;
                </a>
              </div>
            </div>
          {/if}
          {#if msg.value.content.type === 'blog'}
            <div class="card">
              <div class="card-header">
                {#if msg.value.content.title}
                  <div class="card-title h5">{msg.value.content.title}</div>
                {/if}
              </div>
              <div class="card-body">
                {ssb.markdown(msg.value.content.summary)}
              </div>
              <div class="card-footer">
                <span class="float-left">{timestamp(msg.value.timestamp)}</span>
                <a
                  href={patchfox.url('hub', 'thread', { thread: msg.key })}
                  class="btn btn-link float-right">
                  &rarr;
                </a>
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
