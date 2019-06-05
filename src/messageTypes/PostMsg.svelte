<script>
  export let msg;

  let content = ssb.markdown(msg.value.content.text);

  let rootId = false;
  let branchId = false;
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
        <input type="checkbox" />
        <i class="form-icon" />
        Like
      </label>
      {#if rootId || branchId}
        {#if msg.value.content.root}
          <span>
            <a href="?thread={rootId}#/thread">(root)</a>
          </span>
        {/if}
        {#if msg.value.content.branch}
          <span>
            <a href="?thread={branchId}#/thread">(in reply to)</a>
          </span>
        {/if}
      {/if}
    </div>
    <div class="column col-6 text-right">
      <button class="btn">Reply</button>
    </div>
  </div>

</div>
