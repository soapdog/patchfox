<script>
  //TODO: fix me.
  const { createEventDispatcher } = require("svelte")
  const AvatarChip = require("../../core/components/AvatarChip.svelte")


  export let feed
  export let dim = false
  

  let image = false
  let name = feed
  let active = false
  let identities = []

  const dispatch = createEventDispatcher()

  const onSuccess = data => {
    identities = data.identities || []
  }

  const onError = error => {
    console.error("error on settings", error)
  }

  browser.storage.local.get().then(onSuccess, onError)

  ssb.avatar(feed).then(data => {
    if (data.image !== null && data.image !== undefined) {
      image = `${patchfox.blobUrl(data.image)}`
    }
    name = data.name
  })

</script>


{#if image}
<div class="avatar" class:online={window.hasOwnProperty("ssb") && ssb.feed}>
  <div class="m-1 w-10 h-10 mask mask-squircle" on:click={() => {active = !active}}>
    <img src={image} alt={name} />
  </div>
</div>
{:else}
<div class="avatar placeholder" class:online={window.hasOwnProperty("ssb") && ssb.feed}>
  <div class="bg-neutral-focus text-neutral-content rounded-full w-10 h-10" on:click={() => {active = !active}}>
    <span class="text-3xl">{name.slice(1,3)}</span>
  </div>
</div>
{/if}

<div class="modal" class:modal-open={active} id="identity-switcher-modal">
  <div class="modal-box bg-base-200 text-base-content">
    <button class="btn btn-ghost btn-square float-right" aria-label="Close" on:click={() => {console.log("click"); active = false}}>
      <i class="fas fa-times" />
    </button>
    <h2 class="uppercase font-medium text-center mb-4">Identities</h2>
    <div class="flex flex-col">
      {#each Object.keys(identities) as key}
      <div class="flex">
          {#if window.ssb}
        <div class="flex-none">
          <AvatarChip feed={"@" + identities[key].keys.public} />
        </div>
          {/if}
            
          <div class="flex-none">
            <button class="btn btn-sm btn-link" on:click={() => {
              window.open(patchfox.url("hub","public",{identity: identities[key].keys.public}))
            }}>Open in new tab</button>
          </div>
      </div>
      {:else}
      <div class="hero bg-base-200">
        <div class="text-center hero-content">
          <div class="max-w-md">
            <h1 class="mb-5 text-5xl font-bold">
              No Identities Saved
            </h1> 
            <p class="mb-5">
              Add your identities using the settings.
            </p> 
            <button class="btn btn-primary" on:click={() => patchfox.go("settings")}>Go to settings</button>
          </div>
        </div>
      </div>
      {/each}
    </div>      
  </div>
</div>

