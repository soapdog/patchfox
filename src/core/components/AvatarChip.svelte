<script>
  const { createEventDispatcher } = require("svelte")

  export let feed

  export let inline = false
  export let arrow = false
  export let glyph = false

  let flexClass = inline ? "inline-flex" : "flex" 

  let image = false
  let name = feed

  const dispatch = createEventDispatcher()

  ssb.avatar(feed).then(data => {
    if (!data.hasOwnProperty("name")) {
      name = feed
      return
    }

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
<div class="{flexClass} items-center p-1 gap-1 justify-center cursor-pointer" on:click="{avatarClick}">
  <figure class="avatar">
    <div class="mb-1 w-4 h-4 mask mask-squircle">
      <img src="{image}" alt="{name}" />
    </div>
  </figure>
  <span class="flex-1 inline-block align-middle">{name}</span>
</div>
{:else}
<div class="{flexClass} items-center p-1 gap-1 justify-center cursor-pointer" on:click="{avatarClick}">
  <figure class="avatar" data-initial="{name.slice(1,3)}">
    <div class="mb-1 bg-neutral-focus text-neutral-content w-4 h-4 mask mask-squircle">
      <span class="text-xl">{name.slice(1,3)}</span>
    </div>
  </figure>
  <span class="flex-1 inline-block align-middle">{name}</span>
</div>
{/if}
{#if arrow}
    <span class="mr-2">&rarr;</span>
{/if}

{#if glyph}
    <span class="mr-2">{ssb.markdown(glyph,true)}</span>
{/if}
