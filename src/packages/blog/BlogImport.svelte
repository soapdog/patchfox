<script>
  const Parser = require("rss-parser");
  const parser = new Parser();
  const TurndownService = require("turndown");
  const turndownService = new TurndownService();

  let feedUrl = localStorage.getItem("blog-import-feed") || "";
  let feed = false;
  let loading = false;

  const fetchFeed = async () => {
    loading = true;
    feed = await parser.parseURL(feedUrl);
    localStorage.setItem("blog-import-feed", feedUrl);
    loading = false;
  };
</script>

<div class="container">
  <h1 class="h1">Import RSS/Atom</h1>
  <div class="input-group">
    <span class="input-group-addon">RSS or ATOM</span>
    <input
      type="text"
      class="form-input"
      placeholder="URL to feed"
      bind:value={feedUrl} />
    <button class="btn btn-primary input-group-btn" on:click={fetchFeed}>
      Fetch
    </button>
  </div>
  <br />
  <br />
  {#if loading}
    <div class="loading loading-lg" />
  {/if}
  {#if feed}
    <div class="content">
      <div class="card">
        <div class="card-header">
          <div class="card-title h3">{feed.title}</div>
          <a class="card-subtitle h5" href={feed.link}>{feed.link}</a>
        </div>

        <div class="card-body">
          <p>{feed.description}</p>
        </div>
      </div>
      <br />
      <br />
      {#each feed.items as item}
        <div class="card">
          <div class="card-header">
            <div class="card-title h5">{item.title}</div>
            <div class="card-subtitle h6">{item.pubDate}</div>
          </div>
          <div class="card-body">
            {@html item.contentSnippet.slice(0, 1000)}
          </div>
          <div class="card-footer">
            <a
              href={patchfox.url('blog', 'compose', {
                content: turndownService.turndown(item.content),
                summary: item.contentSnippet,
                title: item.title
              })}
              class="btn btn-sm btn-primary">
              Compose new blog post using this content
            </a>
          </div>
        </div>
      {/each}

    </div>
  {/if}
</div>
