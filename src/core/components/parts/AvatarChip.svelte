<script>
  const { createEventDispatcher } = require("svelte");

  export let feed;
  

  let image = false;
  let name = feed;

  const dispatch = createEventDispatcher();
    
  ssb.avatar(feed).then(data => {
    if (data.image !== null) {
      image = `http://localhost:8989/blobs/get/${data.image}`;
    }
    name = data.name;
  });

  const avatarClick = () => {
    dispatch("avatarClick", {feed, name})
  };
</script>

<style>
  .clickable:hover {
    cursor: hand;
  }
</style>

{#if image}
  <div class="chip clickable" on:click={avatarClick}>
    <img src={image} class="avatar avatar-sm" alt={name} />
    {name}
  </div>
{:else}
  <span class="chip clickable" on:click={avatarClick}>{name}</span>
{/if}
