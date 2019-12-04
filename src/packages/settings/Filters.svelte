<script>
  const { getPref, setPref } = patchfox;
  const {
    getFilters,
    addFilter,
    deleteFilter
  } = require("../../core/platforms/ssb/abusePrevention.js");

  // Abuse Prevention - filters
  let currentFilters = getFilters();
  let filterFeed = "";
  let filterChannel = "";
  let filterKeywords = "";
  let filterExpiry = "";
  let filterAction = "";

  const addNewFilter = () => {
    let keywords = filterKeywords
      .split(",")
      .map(v => v.trim())
      .filter(v => v.length !== 0);

    let filter = {};
   

    if (filter.channel && filter.channel.startsWith("#")) {
      filter.channel = filter.channel.slice(1);
    }

    if (
      filter.action &&
      (filter.feed || filter.channel || filter.keywords.length > 0)
    ) {
      addFilter(filter);

      currentFilters = getFilters();

      console.dir("filters", currentFilters);

      filterFeed = "";
      filterChannel = "";
      filterKeywords = "";
      filterExpiry = "";
      filterAction = "";
    } else {
      alert("Fill at least filter action and one of feed, channel or keywords");
    }
  };
</script>

<h1 class="title">Filters</h1>
<p>
  Use the features from this section to tailor your Patchfox experience to suit
  your needs.
</p>
<h5>Filters</h5>
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
<div class="container">
  <div class="columns">
    {#each currentFilters as filter}
      <div class="column col-12">
        <div class="card filter">
          <div class="card-header">
            <div class="card-title h5">{filter.action}</div>
          </div>
          <div class="card-body">
            <ul>
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
                  <li>Containing: {filter.keywords.join(', ')}</li>
                </i>
              {/if}
              {#if filter.expires}
                <li>Expiring in {filter.expires}</li>
              {/if}
            </ul>
          </div>
          <div class="card-footer">
            <button
              class="btn"
              aria-label="Delete"
              on:click={() => {
                deleteFilter(filter);
                currentFilters = getFilters();
              }}>
              Delete
            </button>
          </div>
        </div>
      </div>
    {:else}
      <div class="column col-12">
        <p class="label">You don't have any filter yet.</p>
      </div>
    {/each}
  </div>
</div>
<h5>New Filter</h5>
<form-group>
  <label class="form-radio">
    <input
      type="radio"
      name="filter-action"
      bind:group={filterAction}
      value="hide" />
    <i class="form-icon" />
    Hide Message
  </label>
  <label class="form-radio">
    <input
      type="radio"
      name="filter-action"
      bind:group={filterAction}
      value="blur" />
    <i class="form-icon" />
    Blur Images
  </label>
  <label class="form-label" for="remote">Channel</label>
  <input
    class="form-input"
    type="text"
    placeholder="Channel"
    bind:value={filterChannel} />
  <label class="form-label" for="remote">Feed</label>
  <input
    class="form-input"
    type="text"
    placeholder="Feed"
    bind:value={filterFeed} />
  <label class="form-label" for="remote">Keywords</label>
  <input
    class="form-input"
    type="text"
    placeholder="Keywords separated by commas"
    bind:value={filterKeywords} />
  <label class="form-label" for="remote">Expiration Date</label>
  <input
    class="form-input"
    type="date"
    placeholder="When should this filter expiry"
    bind:value={filterExpiry} />
</form-group>
<br />
<button class="btn btn-primary" on:click={addNewFilter}>Add Filter</button>
<br />
<br />
