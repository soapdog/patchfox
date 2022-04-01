<script>
  const AvatarMenuItem = require("./AvatarMenuItem.svelte")
  const AvatarContainer = require("./AvatarContainer.svelte")
  const AvatarChip = require("./AvatarChip.svelte")


  const { createEventDispatcher } = require("svelte")
  const dispatch = createEventDispatcher()


  export let msg
  let dropdownActive = false
  let state = "waitclick" // "loading", "loaded", "error"
  let error = ""

  let voters = []

  const loadVotes = () => {
    state = "loading"
    ssb
      .votes(msg)
      .then(vs => {
        voters = vs
        state = "loaded"
      })
      .catch(n => {
        error = n
        state = "error"
      })
  }

  const avatarClick = ev => {
    let feed = ev.detail.feed
    let name = ev.detail.name

    patchfox.go("contacts", "profile", { feed })
  }

  setTimeout(loadVotes, 500)
</script>

<style>
  .clickable:hover {
    cursor: pointer;
  }

  .vote-counter {
    display: inline-block;
    padding-left: 5px;
    padding-right: 5px;
  }
</style>

<div class="vote-counter">
  {#if state == "loading"}
    <div class="flex justify-center">
      <i class="fas fa-spinner fa-spin" />
    </div>
  {:else if state == "loaded" && voters.length > 0}
    <div class="dropdown">
      <label
        class:dropdown-open={dropdownActive}
        on:click={() => (dropdownActive = !dropdownActive)}
        class="btn btn-link"
        tabindex="0">
        💜 {voters.length}
      </label>
      <div tabindex=0 class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
        <AvatarContainer>
        {#each voters as user}
          <li>
            <AvatarChip feed={user} on:avatarClick={avatarClick}/>
          </li>
        {/each}
      </AvatarContainer>
      </div>
    </div>
  {:else if state == "loaded" && voters.length == 0}
    <span>💜 0</span>
  {:else if state == "error"}
    <span>💔 can't load</span>
  {:else}
    <span class="c-hand text-primary" on:click={() => {loadVotes()}}>(get votes)</span>
  {/if}
</div>
