<script>
  const Spinner = require("../../core/components/Spinner.svelte")

  const Parser = require("rss-parser")
  const parser = new Parser()
  const TurndownService = require("turndown")
  const turndownService = new TurndownService()

  let feedUrl = localStorage.getItem("blog-import-feed") || ""
  let feed = false
  let loading = false

  const fetchFeed = async () => {
    loading = true
    feed = await parser.parseURL(feedUrl)
    localStorage.setItem("blog-import-feed", feedUrl)
    loading = false
    console.log("feed", feed)
  }
</script>

<div class="container">
  <h1 class="uppercase font-medium text-xl">Import RSS/Atom</h1>
  <div class="form-control">
    <label class="label">
      <span class="label-text">RSS or ATOM</span>
    </label>
    <input
    type="text"
    class="input input-bordered"
    placeholder="URL to feed"
    bind:value={feedUrl} />
  </div>
  <button class="btn btn-primary mt-2" on:click={fetchFeed}>
    Fetch
  </button>
  <br />
  <br />
  {#if loading}
  <Spinner />
  {/if}
  {#if feed}
  <div class="container">
    <div class="card bordered bg-base-200">
      <div class="card-body">
        <div class="card-title uppercase">{feed.title}</div>
        <a class="card-subtitle text-md" href={feed.link}>{feed.link}</a>

        <p class="prose">{feed.description ?? "no description given."}</p>
      </div>
    </div>
    <br />
    <br />
    {#each feed.items as item}
    {@debug item}
    <div class="card shadow mb-4">
      <div class="card-body">
        <div class="card-title text-md">{item.title}</div>
        <div class="card-subtitle font-thin mb-4">{item.pubDate}</div>

        <div class="prose">
          {#if item.contentSnippet}
          {@html item.contentSnippet.slice(0, 1000)}
          {:else if item.summary}
          {@html item.summary.slice(0, 1000)}
          {/if}
        </div>
        <div class="card-actions justifty-end">
          <a
          href={patchfox.url("blog", "compose", {
            content: turndownService.turndown(item.content ? item.content : item.summary),
            summary: item.contentSnippet ?? item.summary,
            title: item.title
          })}
          class="btn">
          Compose new blog post using this content
        </a>
      </div>
    </div>
  </div>
  {/each}

</div>
{/if}
</div>
