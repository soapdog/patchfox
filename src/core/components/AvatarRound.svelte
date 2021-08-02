<script>
  const { createEventDispatcher } = require("svelte")

  export let feed
  export let dim = false
  

  let image = false
  let name = feed

  const dispatch = createEventDispatcher()
    
  ssb.avatar(feed).then(data => {
    if (data.image !== null && data.image !== undefined) {
      image = `${patchfox.blobUrl(data.image)}`
    }
    name = data.name
  })

  const avatarClick = () => {
    dispatch("avatarClick", {feed, name})
  }
</script>

<style>
  .clickable:hover {
    cursor: pointer;
  }

  .dim {
    opacity: 0.4;
  }

  .fix {
    object-fit: cover;
  }
</style>

{#if image}
  <figure class="avatar avatar-xl clickable" on:click={avatarClick} class:dim>
    <img class="fit" src={image} alt={name} />
  </figure>
{:else}
  <figure class="avatar avatar-xl clickable" data-initial="{name.slice(1,3)}" on:click={avatarClick} class:dim></figure>
{/if}
