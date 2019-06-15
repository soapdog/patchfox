<script>
  import { navigate } from "../utils.js";

  export let msg;

  let content = ssb.markdown(msg.value.content.text);
  let liked = false;

  ssb.votes(msg.key).then(ms => {
    ms.forEach(m => {
      let author = m.value.author;
      if ((author === ssb.feed && m.value.content.vote.value === 1)) {
        liked = true;
      }
    });
  });

  const likeChanged = ev => {
    let v = ev.target.checked;
    if (v) {
      ssb
        .like(msg.key)
        .then(() => console.log("liked", msg.key))
        .catch(() => (liked = false));
    } else {
      ssb
        .unlike(msg.key)
        .then(() => console.log("unliked", msg.key))
        .catch(() => (liked = true));
    }
  };

  const reply = ev => {
    let rootId = msg.value.content.root || msg.key;
    let channel = msg.value.content.channel;
    let replyfeed = msg.value.author;
    navigate("/compose", { root: rootId, branch: msg.key, channel, replyfeed });
  };

  const goRoot = ev => {
    let rootId = msg.value.content.root || msg.key;
    navigate("/thread", { thread: rootId });
  };

  const goBranch = ev => {
    let branchId = msg.value.content.branch || msg.key;
    navigate("/thread", { thread: branchId });
  };
</script>

<style>
  div img.is-image-from-blob {
    max-width: 90%;
  }
</style>

<div class="card-body">
  {@html content}
</div>
<div class="card-footer">
  <div class="columns col-gapless">
    <div class="column col-6">
      <label class="form-switch d-inline">
        <input type="checkbox" on:change={likeChanged} checked={liked} />
        <i class="form-icon" />
        Like
      </label>
      {#if msg.value.content.root}
        <span>
          <a
            href="?thread={encodeURIComponent(msg.value.content.root)}#/thread"
            on:click|preventDefault={goRoot}>
            (root)
          </a>
        </span>
      {/if}
      {#if msg.value.content.branch}
        <span>
          <a
            href="?thread={encodeURIComponent(msg.value.content.branch)}#/thread"
            on:click|preventDefault={goBranch}>
            (in reply to)
          </a>
        </span>
      {/if}
    </div>
    <div class="column col-6 text-right">
      <button class="btn" on:click={reply}>Reply</button>
    </div>
  </div>

</div>
