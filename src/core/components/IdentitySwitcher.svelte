<script>
  const { createEventDispatcher } = require("svelte")
  const AvatarRound = require("../../core/components/AvatarRound.svelte")


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
    <div class="modal-header">
      <button class="btn btn-ghost btn-square float-right" aria-label="Close" on:click={() => {console.log("click"); active = false}}>
        <i class="fas fa-times">
        </button>
      <h2>Identities</h2>
    </div>
    <div class="modal-body">
        <div class="flex">
        {#each Object.keys(identities) as key}
        <div class="bordered">
          {#if window.ssb}
          <AvatarRound feed={"@" + identities[key].keys.public} />
          {/if}
          <div>
            <h2>{identities[key].keys.public}</h2>
            <p>
              <span>Server Type: <code>{identities[key].type}</code></span><br>
              <span>Remote: <code class="text-ellipsis d-inline-block" style="width:  300px">{identities[key].remote}</code></span>
            </p>
              <button class="btn btn-sm" on:click={() => {
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
</div>
