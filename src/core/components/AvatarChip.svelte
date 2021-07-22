<script>
  const { createEventDispatcher } = require("svelte")

  export let feed

  let image = false
  let name = feed

  const dispatch = createEventDispatcher()

  ssb.avatar(feed).then(data => {
    if (data.image !== null && data.image !== undefined) {
      image = `${patchfox.httpUrl("/blobs/get/" + data.image)}`
    }
    name = data.name
  })

  const avatarClick = () => {
    dispatch("avatarClick", { feed, name })
  }
</script>

<style>
  .clickable:hover {
    cursor: pointer;
  }

  .fix-a {
    margin-bottom: 8px;
    max-width: unset;
  }
  .fix-img {
    object-fit: cover;
  }
</style>

{#if image}
  <a
    href={patchfox.url('contacts', 'profile', { feed })}
    class="chip clickable d-flex text-ellipsis fix-a"
    title={name}
    aria-label={name}
    on:click|preventDefault|stopPropagation={avatarClick}>
    <img src={image} class="fix-img avatar avatar-sm" data-initial="{name.slice(1,3)}" alt={name} />
    {name}
  </a>
  {:else}
  <a
    href={patchfox.url('contacts', 'profile', { feed })}
    class="chip clickable d-flex text-ellipsis fix-a"
    title={name}
    aria-label={name}
    on:click|preventDefault|stopPropagation={avatarClick}>
    {name}
  </a>
{/if}
