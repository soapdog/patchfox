<script>
  const { createEventDispatcher } = require("svelte")

  export let feed

  let image = false
  let name = feed

  const dispatch = createEventDispatcher()

  ssb.avatar(feed).then(data => {
    if (data.image !== null) {
      image = `${patchfox.httpUrl("/blobs/get/" + data.image)}`
    }
    name = data.name
  })

  const avatarClick = () => {
    dispatch("avatarClick", { feed, name })
  }
</script>

{#if image}
  <a
    href={patchfox.url("contacts", "profile", { feed })}
    class="cursor-pointer"
    on:click|preventDefault|stopPropagation={avatarClick}>
    <figure class="mb-1 w-4 h-4 mask mask-squircle">
      <img src={image} class="object-cover avatar avatar-sm" alt={name} />
    </figure>
    <span>{name}</span>
  </a>
{:else}
  <a
    href={patchfox.url("contacts", "profile", { feed })}
    class="cursor-pointer"
    on:click|preventDefault|stopPropagation={avatarClick}>
    <span>{name}</span>
  </a>
{/if}
