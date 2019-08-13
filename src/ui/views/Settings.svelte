<script>
  const { onMount } = require("svelte");
  const { navigate } = require("../utils.js");
  const {
    getPref,
    setPref,
    setConnectionConfiguration
  } = require("../prefs.js");
  const {
    getFilters,
    addFilter,
    deleteFilter
  } = require("../abusePrevention.js");

  let keys = {};
  let remote = "";
  let limit = getPref("limit", 10);
  let columnSize = getPref("columnSize", "short");

  document.title = "Patchfox - Settings";

  // message type filters
  let showTypeUnknown = getPref("showTypeUnknown", false);
  let showTypeAbout = getPref("showTypeAbout", true);
  let showTypeBlog = getPref("showTypeBlog", true);
  let showTypeChannel = getPref("showTypeChannel", true);
  let showTypeContact = getPref("showTypeContact", true);
  let showTypePost = getPref("showTypePost", true);
  let showTypePrivate = getPref("showTypePrivate", true);
  let showTypePub = getPref("showTypePub", true);
  let showTypeVote = getPref("showTypeVote", true);

  // Abuse Prevention - filters
  let currentFilters = getFilters();
  let filterFeed = "";
  let filterChannel = "";
  let filterKeywords = "";
  let filterExpiry = "";
  let filterAction = "";

  const saveConfiguration = ev => {
    setConnectionConfiguration({ remote, keys: JSON.parse(keys), manifest });
    navigate("/public");
    location.reload();
  };

  const selectedFile = ev => {
    const secretFile = ev.target.files[0];
    const reader = new FileReader();
    reader.onload = function(evt) {
      console.log(evt.target.result);
      const contents = evt.target.result;
      let secret = contents.split("\n").filter(function(line) {
        return line.indexOf("#") != 0;
      });
      secret = JSON.parse(secret.join("\n"));
      remote = `ws://localhost:8989~shs:${secret.id.slice(
        0,
        secret.id.indexOf("=") + 1
      )}`;
      updateUI({ keys: secret, remote });
    };
    reader.readAsText(secretFile);
  };

  const updateUI = savedData => {
    console.log("saved data from settings", savedData);
    remote = savedData.remote || "";
    if (savedData.keys) {
      keys = JSON.stringify(savedData.keys, null, 2);
    } else {
      keys = "";
    }
  };

  const onError = error => {
    console.error("error on settings", error);
  };

  const gettingStoredSettings = browser.storage.local
    .get()
    .then(updateUI, onError);

  const addNewFilter = () => {
    let keywords = filterKeywords
      .split(",")
      .map(v => v.trim())
      .filter(v => v.length !== 0);

    let filter = {};
    filter.action = filterAction.length !== 0 ? filterAction : false;
    filter.feed = filterFeed.length !== 0 ? filterFeed : false;
    filter.channel = filterChannel.length !== 0 ? filterChannel : false;
    filter.keywords = keywords;
    filter.expires = filterExpiry.length !== 0 ? filterExpiry : false;

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

<style>
  .filter {
    height: 300px;
    margin-bottom: 0.4rem;
    overflow: hidden;
  }

  .feed {
    max-width: 100%;
    overflow: hidden;
  }
</style>

<h1>Settings</h1>
<p>
  Settings changes are saved as you make them except for identity and connection
  changes, those require a full page reload and thus you need to press a save
  button. The reason behind this is that Patchfox needs to disconnect and
  reconnect to the
  <i>ssb-server</i>
  using the new info.
</p>
<p>
  <b>
    You can't use Patchfox until you fill your
    <i>Connection & Identity</i>
    information.
    <a
      href="/docs/index.html#/troubleshooting/no-configuration"
      target="_blank">
      If you want more help regarding connection and configuration click here
    </a>
    .
  </b>
</p>

<h4>Connection & Identity</h4>

<form class="form-group">
  <label class="form-label" for="secret-file">
    Patchfox can infer the values for both
    <i>remote</i>
    and
    <i>secret</i>
    from your
    <code>~/.ssb/secret</code>
    file. You can use the button below to browse for it.
  </label>
  <input
    type="file"
    class="form-input"
    id="secret-file"
    on:change={selectedFile} />
  <label class="form-label" for="remote">Remote</label>
  <input
    class="form-input"
    type="text"
    id="remote"
    placeholder="remote"
    bind:value={remote} />

  <label class="form-label" for="secret">Secret</label>
  <textarea
    class="form-input"
    id="secret"
    placeholder="Your secret"
    rows="8"
    bind:value={keys} />
  <br />
  <button class="btn btn-primary float-right" on:click={saveConfiguration}>
    Save Identity & Remote
  </button>
  <p>Saving identity and remote will cause a full page refresh.</p>
</form>

<h4>Vieweing Experience</h4>
<form class="form-group">
  <label class="form-label" for="limit">Messages per page</label>
  <input
    class="form-input"
    type="number"
    bind:value={limit}
    on:change={() => setPref('limit', limit)} />

  <br />
  <span>
    Which message types you want to see?
    <a target="_blank" href="/docs/index.html#/message_types/">
      Click here for more information about
      <i>Message Types</i>
    </a>
  </span>
  <label class="form-switch">
    <input
      type="checkbox"
      bind:checked={showTypeAbout}
      on:change={ev => {
        setPref('showTypeAbout', showTypeAbout);
      }} />
    <i class="form-icon" />
    <b>About</b>
    (aka people setting avatars and descriptions; gatherings)
  </label>
  <label class="form-switch">
    <input
      type="checkbox"
      bind:checked={showTypeBlog}
      on:change={ev => {
        setPref('showTypeBlog', showTypeBlog);
      }} />
    <i class="form-icon" />
    <b>Blog</b>
    (Longform text posts)
  </label>
  <label class="form-switch">
    <input
      type="checkbox"
      bind:checked={showTypeChannel}
      on:change={ev => {
        setPref('showTypeChannel', showTypeChannel);
      }} />
    <i class="form-icon" />
    <b>Channel</b>
    (People subscribing to channels)
  </label>
  <label class="form-switch">
    <input
      type="checkbox"
      bind:checked={showTypeContact}
      on:change={ev => {
        setPref('showTypeContact', showTypeContact);
      }} />
    <i class="form-icon" />
    <b>Contact</b>
    (People following each other)
  </label>
  <label class="form-switch">
    <input
      type="checkbox"
      bind:checked={showTypePost}
      on:change={ev => {
        setPref('showTypePost', showTypePost);
      }} />
    <i class="form-icon" />
    <b>Posts</b>
    (Common content post, leave this on or it is not that fun)
  </label>
  <label class="form-switch">
    <input
      type="checkbox"
      bind:checked={showTypePub}
      on:change={ev => {
        setPref('showTypePub', showTypePub);
      }} />
    <i class="form-icon" />
    <b>Pub</b>
    (Pub servers announcements)
  </label>

  <label class="form-switch">
    <input
      type="checkbox"
      bind:checked={showTypePrivate}
      on:change={ev => {
        setPref('showTypePrivate', showTypePrivate);
      }} />
    <i class="form-icon" />
    <b>Private</b>
    (Private messages; You won't be able to read them, but you'll see their
    encrypted content passing by)
  </label>

  <label class="form-switch">
    <input
      type="checkbox"
      bind:checked={showTypeVote}
      on:change={ev => {
        setPref('showTypeVote', showTypeVote);
      }} />
    <i class="form-icon" />
    <b>Vote</b>
    (People liking/digging stuff)
  </label>
  <div class="divider" />
  <label class="form-switch">
    <input
      type="checkbox"
      bind:checked={showTypeUnknown}
      on:change={ev => {
        setPref('showTypeUnknown', showTypeUnknown);
      }} />
    <i class="form-icon" />
    <b>Unknown</b>
    (Show messages Patchfox doesn't understand as their raw content)
  </label>
  <br />
  <label class="form-label">
    Feed column size. There is research that says that a short column size makes
    for a more pleasant reading experience, still some users prefer to use the
    full screen space. Your choice is between reading through long text lines or
    short ones.
  </label>
  <label class="form-radio">
    <input
      type="radio"
      name="column-size"
      bind:group={columnSize}
      on:change={() => setPref('columnSize', columnSize)}
      value="short" />
    <i class="form-icon" />
    Short column
  </label>
  <label class="form-radio">
    <input
      type="radio"
      name="column-size"
      bind:group={columnSize}
      on:change={() => setPref('columnSize', columnSize)}
      value="long" />
    <i class="form-icon" />
    Long column
  </label>
</form>
<h4>Abuse Prevention</h4>
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
      <div class="column col-6">
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
              {#if filter.keywords.length > 0}
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
