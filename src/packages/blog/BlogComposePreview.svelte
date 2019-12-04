<script>
export let channel;
export let title;
export let contentWarning;
export let content;
export let summary;
export let thumbnail;
</script>

<style>
  .thumbnail-preview {
    max-height: 200px;
  }
</style>

<h2>Post preview</h2>
{#if channel || contentWarning.length > 0 || title || thumbnail}
  <blockquote>
    {#if channel}
      <p>
        <b>Channel:</b>
        {channel.startsWith('#') ? channel.slice(1) : channel}
      </p>
    {/if}
    {#if contentWarning.length > 0}
      <p>
        <b>Content Warning:</b>
        {contentWarning}
      </p>
    {/if}
    {#if title}
      <p>
        <b>title:</b>
        {title}
      </p>
    {/if}
    {#if summary}
      <p>
        <b>Summary:</b>
        {@html ssb.markdown(summary)}
      </p>
    {/if}
    {#if thumbnail}
      <p>
        <b>Thumbnail:</b>
        <img
          class="thumbnail-preview"
          src="http://localhost:8989/blobs/get/{thumbnail}"
          alt="post thumbnail" />
      </p>
    {/if}
  </blockquote>
{/if}
{@html ssb.markdown(content)}


