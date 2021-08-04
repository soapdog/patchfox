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

<style>
.modal.active {
  opacity: unset;
  visibility: unset;
}
</style>

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

<input type="checkbox" id="identity-switcher-toggle" bind:value={active} class="modal-toggle"> 
<div class="modal" class:active id="modal-id">
  <a href="#close" class="modal-overlay" aria-label="Close" on:click={() => active = false}></a>
  <div class="modal-box">
    <div class="modal-header">
      <a href="#close" class="btn btn-ghost float-right" aria-label="Close" on:click={() => active = false}><i class="fas fa-close"></a>
      <h3 class="modal-title h5">Identities</h3>
    </div>
    <div class="modal-body">
      <div class="content">
        <div>
        {#each Object.keys(identities) as key}
        <div class="tile">
          {#if window.ssb}
          <div class="tile-icon">
            <AvatarRound feed={"@" + identities[key].keys.public} />
          </div>
          {/if}
          <div class="tile-content">
            <p class="tile-title">{identities[key].keys.public}</p>
            <p class="tile-subtitle text-tiny">
              <span>Server Type: <code>{identities[key].type}</code></span><br>
              <span>Remote: <code class="text-ellipsis d-inline-block" style="width:  300px">{identities[key].remote}</code></span>
            </p>
          <p>
            <button class="btn btn-sm" on:click={() => {
              window.open(patchfox.url("hub","public",{identity: identities[key].keys.public}))
            }}>Open in new tab</button>
          </p>
          </div>
        </div>
        {:else}
          <div class="card">
            <div class="card-header">
              <h5 class="card-title h5">No identities saved</h5>
            </div>
            <div class="card-body">
              <p>You haven't saved any SSB identity yet.</p>
            </div>
          </div>
        {/each}
        </div>      
      </div>
    </div>
    <div class="modal-footer">
    </div>
  </div>
</div>
