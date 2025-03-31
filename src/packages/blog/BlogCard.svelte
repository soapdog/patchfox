<script>
  const Card = require("../../core/components/ui/Card.svelte")
  const VoteCounter = require("../../core/components/VoteCounter.svelte")

  export let msg

  let content = msg.value.content

  let summary = ssb.markdown(content.summary)
  let thumbnail = content.thumbnail || false
  let title = content.title || false
  let showBlogpost = false
  let loading = false
  let toast = false
  let toastMsg = ""
  let showRaw = false
  let post = summary
  let hasContentWarning = content.contentWarning && content.contentWarning.length > 0
  let encodedThumbnail = encodeURIComponent(thumbnail) || false

  let liked = false

  ssb.votes(msg.key).then(ms => {
    ms.forEach(m => {
      let author = m.value.author
      if (author === ssb.feed && m.value.content.vote.value === 1) {
        liked = true
      }
    })
  })

  const likeChanged = ev => {
    let v = ev.target.checked
    if (v) {
      ssb
        .like(msg.key)
        .then(() => console.log("liked", msg.key))
        .catch(() => (liked = false))
    } else {
      ssb
        .unlike(msg.key)
        .then(() => console.log("unliked", msg.key))
        .catch(() => (liked = true))
    }
  }

  const displayBlogPost = ev => {
    loading = true

    ssb
      .getBlob(content.blog)
      .then(data => {
        post = ssb.markdown(data)
        showBlogpost = true
      })
      .catch(err => {
        console.error("can't load blog post", err)
        toast = true
        toastMsg = err
      })
  }

  const reply = ev => {
    let rootId = msg.value.content.root || msg.key
    let channel = msg.value.content.channel
    patchfox.go("post", "compose", { root: rootId, branch: msg.key, channel })
  }

  const fork = ev => {
    let originalRoot = msg.value.content.root || msg.key
    let channel = msg.value.content.channel
    let replyfeed = msg.value.author
    patchfox.go("post", "compose", {
      root: msg.key,
      branch: msg.key,
      fork: originalRoot,
      channel,
      replyfeed
    })
  }

  const goRoot = ev => {
    let rootId = msg.value.content.root || msg.key
    patchfox.go("hub", "thread", { thread: rootId })
  }

  const goBranch = ev => {
    let branchId = msg.value.content.branch || msg.key
    patchfox.go("hub", "thread", { thread: branchId })
  }

  // eslint-disable-next-line no-constant-condition
  if (!hasContentWarning && false) {
    setTimeout(displayBlogPost, 100)
  }
</script>

<style>
  div img.is-image-from-blob {
    max-width: 90%;
  }
</style>

<Card {msg} {showRaw}>
  {#if thumbnail}
    <div class="card-image">
      <img
        src={patchfox.httpUrl("/blobs/get/" + encodedThumbnail)}
        class="img-responsive"
        alt={title} />
    </div>
  {/if}
  {#if title}
    <h1 class="card-title h5">{title}</h1>
  {/if}

  {#if toast}
    <div class="toast toast-error">Can't load blogpost: {toastMsg}</div>
  {/if}
  {#if hasContentWarning}
    <div class="toast toast-primary">
      <p>
        <b>Content Warning:</b>
        {msg.value.content.contentWarning}
      </p>
    </div>
  {/if}

  <article class="prose">
  {#if showBlogpost}
    {@html post}
  {:else}
    {@html summary}
  {/if}
  </article>
  <div slot="card-actions" class="card-actions justifty-end" >
    <div>
        <div class="form-control">
          <label class="cursor-pointer label">
            <span class="label-text">Like</span> 
            <input class="toggle" type="checkbox" on:change={likeChanged} checked={liked} />
          </label>
        </div>
        <span>
          <VoteCounter {msg} />
        </span>
      </div>
      <div class="flex-1"></div>
        {#if msg.value.content.root}

          <span>
            <a
             class="btn btn-ghost"
              href="?pkg=hub&view=thread&thread={encodeURIComponent(msg.value.content.root)}"
              on:click|preventDefault={goRoot}>
              Root msg
            </a>
          </span>
        {/if}
        {#if msg.value.content.branch}
          <span>
            <a
              class="btn btn-ghost"
              href="?pkg=hub&view=thread&thread={encodeURIComponent(msg.value.content.branch)}"
              on:click|preventDefault={goBranch}>
              In reply to
            </a>
          </span>
        {/if}
      {#if !msg.value.private}
        <button class="btn btn-primary" on:click={fork}>Fork</button>

        <button class="btn btn-primary" on:click={reply}>Reply</button>
      {/if}
      {#if showBlogpost}
        <button class="btn btn-primary" on:click={() => showBlogpost = false}>Close blog post</button>
      {:else}
        <button class="btn btn-primary" on:click={displayBlogPost}>Read blog post</button>
      {/if}
  </div>
</Card>
