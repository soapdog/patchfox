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


{#if image}
<div class="flex items-center p-1 gap-1 justify-center">
  <figure class="avatar cursor-pointer" on:click="{avatarClick}">
    <div class="mb-1 w-4 h-4 mask mask-squircle">
      <img src="{image}" alt="{name}" />
    </div>
  </figure>
  <span class="flex-1 inline-block align-middle">{name}</span>
</div>
{:else}
<div class="flex items-center p-1 gap-1 justify-center">
  <figure class="avatar cursor-pointer" data-initial="{name.slice(1,3)}" on:click="{avatarClick}">
    <div class="mb-1 bg-neutral-focus text-neutral-content w-4 h-4 mask mask-squircle">
      <span class="text-xl">{name.slice(1,3)}</span>
    </div>
  </figure>
  <span class="flex-1 inline-block align-middle">{name}</span>
</div>
{/if}
