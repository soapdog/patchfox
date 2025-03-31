<script>
  const AvatarMenuItem = require("./AvatarMenuItem.svelte");
  const { createEventDispatcher } = require("svelte");

  export let msg;
  let dropdownActive = false;
  let state = "waitclick"; // "loading", "loaded", "error"

  let voters = [];

  const loadVotes = () => {
    state = "loading";
    ssb
      .votes(msg)
      .then(vs => {
        voters = vs;
        state = "loaded";
      })
      .catch(n => {
        error = n;
        state = "error";
      });
  };

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
  {#if state == "loading"}
    <span class="loading" />
  {:else if state == "loaded" && voters.length > 0}
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
  {:else if state == "loaded" && voters.length == 0}
    <span>💜 0</span>
  {:else if state == "error"}
    <span>💔 can't load</span>
  {:else}
    <span class="c-hand text-primary" on:click={() => {loadVotes()}}>(get votes)</span>
  {/if}
</div>
