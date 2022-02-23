<script>
  const { getPref, setPref } = patchfox
  const {
    getFilters,
    addFilter,
    deleteFilter
  } = require("../../core/platforms/common/abusePrevention.js")

  // Abuse Prevention - filters
  let currentFilters = getFilters()
  let filterFeed = ""
  let filterChannel = ""
  let filterKeywords = ""
  let filterExpiry = ""
  let filterAction = ""

  const addNewFilter = () => {
    let filter = {}

    let keywords = filterKeywords
      .split(",")
      .map(v => v.trim())
      .filter(v => v.length !== 0)

    if (keywords.length > 0) {
      filter.keywords = keywords
    }

    if (filterAction.length > 0) {
      filter.action = filterAction
    }

    if (filterChannel.length > 0) {
      filter.channel = filterChannel
    }

    if (filterExpiry.length > 0) {
      filter.expiry = filterExpiry
    }

    if (filterFeed.length > 0) {
      filter.feed = filterFeed
    }


    if (filter.channel && filter.channel.startsWith("#")) {
      filter.channel = filter.channel.slice(1)
    }

    console.log("new filter", filter)
    if (
      filter.action &&
      (filter.feed || filter.channel || filter.keywords.length > 0)
    ) {
      addFilter(filter)

      currentFilters = getFilters()

      console.dir("filters", currentFilters)

      filterFeed = ""
      filterChannel = ""
      filterKeywords = ""
      filterExpiry = ""
      filterAction = ""
    } else {
      alert("Fill at least filter action and one of feed, channel or keywords")
    }
  }
</script>

<div class="prose">
<h1 class="title">Filters</h1>
<p>
  Use the features from this section to tailor your Patchfox experience to suit
  your needs.
</p>
<p>
  Use filters to hide messages and blur images. Use any combination of channel,
  feeds and keywords (separated by commas) to create your triggers and make SSB
  the platform you want. Be aware that these filters are saved to your browser,
  they are not shared on the feed, they don't affect gossiping, they only affect
  the displaying of messages and images in Patchfox itself. If you create a
  filter and open a different client, they won't be working there. If you want
  to learn more about
  <a href="/docs/index.html#/features/filters">
    filters, click here to go to the documentation.
  </a>
  You can create as many filters as you want.
</p>
</div>
<div class="container bg-base-100 bordered p-4">
    {#each currentFilters as filter}
        <div class="card shadow filter">
          <div class="card-body">
            <div class="card-title uppercase">{filter.action}</div>
            <ul class="list-disc">
              {#if filter.feed}
                <li>
                  From
                  <a
                    href="?feed={filter.feed}#/profile"
                    target="_blank"
                    class="feed">
                    {filter.feed}
                  </a>
                </li>
              {/if}
              {#if filter.channel}
                <li>
                  On channel
                  <a
                    href="?channel={filter.feed}#/channel"
                    target="_blank"
                    class="feed">
                    #{filter.channel}
                  </a>
                </li>
              {/if}
              {#if filter.keywords && filter.keywords.length > 0}
                <i>
                  <li>Containing: {filter.keywords.join(", ")}</li>
                </i>
              {/if}
              {#if filter.expires}
                <li>Expiring in {filter.expires}</li>
              {/if}
            </ul>
          <div class="card-actions">
            <button
              class="btn"
              aria-label="Delete"
              on:click={() => {
                deleteFilter(filter)
                currentFilters = getFilters()
              }}>
              Delete
            </button>
          </div>
          </div>
        </div>
    {:else}
      <div class="mx-auto">
        <p class="label text-md">You don't have any filter yet.</p>
      </div>
    {/each}
  </div>


<h5 class="uppercase font-medium text-xl mb-4">New Filter</h5>

<div class="w-24 md:w-auto">
  <div class="form-control">
    <label class="label">
      <span class="label-text cursor-pointer">Hide Message</span>
      <input
      class="radio"
      type="radio"
      name="filter-action"
      bind:group={filterAction}
      value="hide">

    </label>
  </div>

  <div class="form-control">
    <label class="label">
      <span class="label-text cursor-pointer">
        Blur Images
      </span>
      <input
      type="radio"
      class="radio"
      name="filter-action"
      bind:group={filterAction}
      value="blur" />
    </label>
  </div>
</div>

  <div class="form-control">
  <label class="label">
    <span class="label-text">Channel</span>
  </label> 
  <input
    class="input input-bordered"
    type="text"
    placeholder="Channel"
    bind:value={filterChannel}>
</div>

  <div class="form-control">
  <label class="label">
    <span class="label-text">Feed</span>
  </label>
  <input
    class="input input-bordered"
    type="text"
    placeholder="Feed"
    bind:value={filterFeed} />
  </div>

  <div class="form-control">
  <label class="label">
    <span class="label-text">Keywords</span>
  </label>
  <input
    class="input input-bordered"
    type="text"
    placeholder="Keywords separated by commas"
    bind:value={filterKeywords} />
  </div>

  <div class="form-control">
  <label class="label">
    <span class="label-text">Expiration Date</span>
  </label>
  <input
    class="input input-bordered"
    type="date"
    placeholder="When should this filter expiry"
    bind:value={filterExpiry} />
  </div>

<br />
<button class="btn btn-primary" on:click={addNewFilter}>Add Filter</button>
<br />
<br />
