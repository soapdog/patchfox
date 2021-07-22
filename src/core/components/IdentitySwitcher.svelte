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
  <figure class="avatar clickable" on:click={() => {active = !active}} class:dim data-initial="{name.slice(1,3)}">
    <img class="fit" src={image} alt={name} />
    {#if window.hasOwnProperty("ssb") && ssb.feed}
    <i class="avatar-presence online"></i>
    {:else}
    <i class="avatar-presence offline"></i>
    {/if}
  </figure>
{:else}
  <figure class="avatar clickable" data-initial="{name.slice(1,3)}" on:click={() => {active = !active}} class:dim>
    {#if window.hasOwnProperty("ssb") && ssb.feed}
    <i class="avatar-presence online"></i>
    {:else}
    <i class="avatar-presence offline"></i>
    {/if}
  </figure>
{/if}

<div class="modal" class:active id="modal-id">
  <a href="#close" class="modal-overlay" aria-label="Close" on:click={() => active = false}></a>
  <div class="modal-container">
    <div class="modal-header">
      <a href="#close" class="btn btn-clear float-right" aria-label="Close" on:click={() => active = false}></a>
      <div class="modal-title h5">Identities</div>
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
</div>      </div>
    </div>
    <div class="modal-footer">
    </div>
  </div>
</div>
