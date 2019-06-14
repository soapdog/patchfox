<script>
  import { navigate } from "../utils.js";

  export let msg;

  let content = msg.value.content;

  let summary = ssb.markdown(content.summary);
  let thumbnail = content.thumbnail || false;
  let title = content.title || false;
  let showBlogpost = false;
  let loading = false;
  let toast = false;
  let toastMsg = "";
  let post = summary;

  const displayBlogPost = ev => {
    ev.stopPropagation();
    ev.preventDefault();

    loading = true;
    console.log("loading blogpost", content.blog);

    ssb
      .getBlob(content.blog)
      .then(data => {
        post = ssb.markdown(data);
        showBlogpost = true;
      })
      .catch(err => {
        console.error("can't load blog post", err);
        toast = true;
        toastMsg = err;
      });
  };

  const reply = ev => {
    let rootId = msg.value.content.root || msg.key;
    let channel = msg.value.content.channel;
    navigate("/compose", { root: rootId, branch: msg.key, channel });
  };

  const goRoot = ev => {
    ev.stopPropagation();
    ev.preventDefault();
    let rootId = msg.value.content.root || msg.key;
    navigate("/thread", { thread: rootId });
  };

  const goBranch = ev => {
    ev.stopPropagation();
    ev.preventDefault();
    let branchId = msg.value.content.branch || msg.key;
    navigate("/thread", { thread: branchId });
  };
</script>

<style>
  div img.is-image-from-blob {
    max-width: 90%;
  }
</style>

{#if thumbnail}
  <div class="card-image">
    <img
      src="http://localhost:8989/blobs/get/{encodeURIComponent(thumbnail)}"
      class="img-responsive"
      alt={title} />
  </div>
{/if}
<div class="card-body">
  {#if title}
    <h1 class="card-title h5">{title}</h1>
  {/if}

  {#if toast}
    <div class="toast toast-error">Can't load blogpost: {toastMsg}</div>
  {/if}
  {#if showBlogpost}
    {@html post}
  {:else}
    {@html summary}
  {/if}
</div>
<div class="card-footer">
  <div class="columns col-gapless">
    <div class="column col-6">
      <label class="form-switch d-inline">
        <input type="checkbox" />
        <i class="form-icon" />
        Like
      </label>
      {#if msg.value.content.root}
        <span>
          <a
            href="?thread={encodeURIComponent(msg.value.content.root)}#/thread"
            on:click={goRoot}>
            (root)
          </a>
        </span>
      {/if}
      {#if msg.value.content.branch}
        <span>
          <a
            href="?thread={encodeURIComponent(msg.value.content.branch)}#/thread"
            on:click={goBranch}>
            (in reply to)
          </a>
        </span>
      {/if}
    </div>
    <div class="column col-6 text-right">
      <button class="btn" on:click={reply}>Reply</button>
      {#if !showBlogpost}
        <button
          class="btn btn-primary"
          class:locating={loading}
          on:click={displayBlogPost}>
          Read Blogpost
        </button>
      {:else}
        <button
          class="btn btn-primary"
          class:locating={loading}
          on:click={() => (showBlogpost = false)}>
          Close Blogpost
        </button>
      {/if}
    </div>
  </div>

</div>
