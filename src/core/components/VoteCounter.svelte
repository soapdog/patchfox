<script>
  const AvatarMenuItem = require("./AvatarMenuItem.svelte");
  const { createEventDispatcher } = require("svelte");

  export let msg;
  let dropdownActive = false;
  let loading = true;
  let error = false;

  let voters = [];

  ssb
    .votes(msg)
    .then(vs => {
      voters = vs;
      loading = false;
    })
    .catch(n => {
      error = n;
      loading = false;
    });

  const avatarClick = () => {
    dispatch("avatarClick", { feed, name });
  };
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
  {#if loading}
    <span class="loading" />
  {:else if voters.length > 0}
    <div class="dropdown">
      <span
        class:active={dropdownActive}
        on:click={() => (dropdownActive = !dropdownActive)}
        class="btn btn-link dropdown-toggle"
        tabindex="0">
        💜 {voters.length}
      </span>
      <ul class="menu">
        {#each voters as user}
          <li class="menu-item">
            <AvatarMenuItem feed={user} />
          </li>
        {/each}
      </ul>
    </div>
  {:else if error !== false}
    <span>💔 can't load</span>
  {:else}
    <span>💜 0</span>
  {/if}
</div>
