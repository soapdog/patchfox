<script>
  const { createEventDispatcher } = require("svelte")
  const { timestamp } = require("./timestamp.js")

  export let feed
  export let time = false

  let image = "images/icon.png"
  let name = feed

  ssb.avatar(feed).then(data => {
    // console.log(`avatar for ${feed}`, data)
    if (data.image !== null && data.image !== undefined) {
      image = patchfox.httpUrl(`/blobs/get/${data.image}`)
    }
    name = data.name
  })

  const dispatch = createEventDispatcher()

  const click = () => {
    dispatch("click")
  }
</script>

<div class="flex flex-row cursor-pointer" on:click>
  <div class="avatar">
    <div class="m-2 w-14 h-14 mask mask-squircle">
      <img src={image} alt={name} />
    </div>
  </div>
  <div class="tile-content">
    <div class="tile-title">{name}</div>
    <small class="tile-subtitle text-gray">
      {#if time}{timestamp(time)}{/if}
    </small>
  </div>
</div>
