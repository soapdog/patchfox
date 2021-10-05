<script>
  const Card = require("../../core/components/ui/Card.svelte")

  export let msg

  let person = msg.value.author
  let otherLink = encodeURIComponent(msg.value.content.about)
  let otherName = msg.value.content.name || msg.value.content.about
  let isThisAboutFeeds = true
  let showRaw = false
  let verb =
    msg.value.content.about === msg.value.author
      ? "self-identifies"
      : "identifies"

  ssb.avatar(msg.value.author).then(data => (person = data.name))

  if (otherName === msg.value.content.about) {
    ssb.avatar(msg.value.content.about).then(data => (otherName = data.name))
  }

  let image = msg.value.content.image
    ? patchfox.httpUrl(`/blobs/get/${encodeURIComponent(
      msg.value.content.image.link
    )}`)
    : false

  if (msg.value.content.description) {
    verb += " with description"
  }

  if (msg.value.content.about.startsWith("%")) {
    isThisAboutFeeds = false // this appear to be a gathering
  }
</script>

<Card {msg} {showRaw}>
  {#if isThisAboutFeeds}
    {person} {verb}
    <div class="flex flex-row cursor-pointer"
      on:click|preventDefault={() => patchfox.go("contacts","profile", {feed: otherLink})}>
       {#if image}
        <div class="avatar">
          <div class="m-2 w-14 h-14 mask mask-squircle">
            <img src={image} alt={otherName} />
          </div>
        </div>
        <div class="tile-content">
          <div class="tile-title">{otherName}</div>
        </div>
        {:else}
        <div class="avatar placeholder">
          <div class="bg-neutral-focus text-neutral-content mask mask-squircle m-2 w-14 h-14">
            <span class="text-xl">{otherName.slice(0,2)}</span>
          </div>
        </div> 
        {/if}
    </div>
    {#if msg.value.content.description}
      <article class="prose">
        {@html ssb.markdown(msg.value.content.description)}
      </article>
    {/if}
  {:else}
    <div class="toast">
       {person} is doing something related to a gathering but gatherings are not
      supported yet, sorry.
    </div>
  {/if}
</Card>
