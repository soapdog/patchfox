<script>
  const pull = require("pull-stream")
  const paramap = require("pull-paramap")
  const sort = require("pull-sort")
  const { onDestroy, tick } = require("svelte")
  const { timestamp } = require("../../core/components/timestamp.js")
  const Spinner = require("../../core/components/Spinner.svelte")


  export let filter = "everyone"
  export let channel = false
  let sbot = ssb.sbot
  let content = []
  let channels = []
  let limit = 50
  let dropdownActive = false


  let opts = {}

  const subscribedChannels = () => {
    if (ssb.platform === "nodejs-ssb") {
      pull(
        sbot.query.read({
          reverse: true,
          query: [
            {
              $filter: {
                value: {
                  author: ssb.feed,
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
          channels = c
          channels.sort()
          channel = channel || channels[0]
          getContentForChannel(channel)
        })
      )
    }
  }

  const getContentForChannel = c => {
    dropdownActive = false
    if (ssb.platform === "nodejs-ssb") {
      content = []
      channel = c
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
      ]

      pull(
        sbot.query.read({
          query,
          reverse: true
        }),
        ssb.filterWithUserFilters(),
        pull.filter(msg => {
          if (msg.value.content.type === "post") {
            let root = msg.value.content.root
            let branch = msg.value.content.branch

            if (branch) return false
            if (root && root !== msg.key) return false
          }
          return true
        }),
        pull.take(limit),
        pull.drain(function(data) {
          content.push(data)
          content = content
        })
      )
    }
  }

  subscribedChannels()
</script>

<style>  
  .masonry {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    grid-template-rows: masonry;
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

  {#if channel}
  <div class="dropdown" class:dropdown-open={dropdownActive}>
    <button class="btn" tabindex="0" on:click={() => dropdownActive = true}>
      {channel}
      <i class="icon icon-caret" />
    </button>
    <!-- menu component -->
    <ul tabindex="0" class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52 h-80 overflow-scroll">
      {#each channels as c}
        <li>
          <a on:click|preventDefault={() => getContentForChannel(c)} href="#">
            {c}
          </a>
        </li>
      {/each}
    </ul>
  </div>
{/if}
</div>
<br>

<div class="zine">
  {#if content.length == 0}
    <Spinner />
  {:else}
    <div class="box-border mx-auto md:masonry before:box-inherit after:box-inherit">
      {#each content as msg}
        <div class="break-inside my-6 rounded-lg">
          {#if msg.value.content.type === "post"}
            <div class="card shadow bg-base-200">
              <div class="card-body">

                <div class="prose">
                {@html ssb.markdown(msg.value.content.text).slice(0, 500).replace(/h1/gi, "h3")}
                <p>{timestamp(msg.value.timestamp)}</p>
              </div>
              <div class="card-actions">
                <a
                  href={patchfox.url("hub", "thread", { thread: msg.key })}
                  class="btn btn-link">
                  Read More
                </a>
              </div>
              </div>
            </div>
          {/if}
          {#if msg.value.content.type === "blog"}
            <div class="card shadow bg-base-200">
              <div class="card-body">
                {#if msg.value.content.title}
                  <div class="card-title h5">{msg.value.content.title}</div>
                {/if}
                <div class="prose">
                {ssb.markdown(msg.value.content.summary)}
                  <p>{timestamp(msg.value.timestamp)}</p>
              </div>
              <div class="card-actions">
                <a
                  href={patchfox.url("hub", "thread", { thread: msg.key })}
                  class="btn btn-link">
                  Read More
                </a>
              </div>
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
