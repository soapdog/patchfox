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

{#if image}
  <figure class="avatar cursor-pointer" on:click={avatarClick}>
    <div class="mb-8 w-14 h-14  mask mask-squircle">
      <img src={image} alt={name} />
    </div>
  </figure>
{:else}
  <figure class="avatar cursor-pointer" data-initial="{name.slice(1,3)}" on:click={avatarClick} class:dim>
     <div class="mb-8 bg-neutral-focus text-neutral-content w-14 h-14  mask mask-squircle">
        <span class="text-3xl">{name.slice(1,3)}</span>
    </div>
  </figure>
{/if}
