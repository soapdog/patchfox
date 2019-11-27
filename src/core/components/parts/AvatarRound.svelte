<script>
  const { createEventDispatcher } = require("svelte");

  export let feed;
  export let dim = false;
  

  let image = false;
  let name = feed;

  const dispatch = createEventDispatcher();
    
  ssb.avatar(feed).then(data => {
    if (data.image !== null) {
      image = `${patchfox.httpUrl("/blobs/get/" + data.image)}`;
    }
    name = data.name;
  });

  const avatarClick = () => {
    dispatch("avatarClick", {feed, name})
  };
</script>

<style>
  .clickable:hover {
    cursor: pointer;
  }

  .dim {
    opacity: 0.4;
  }
</style>

{#if image}
  <figure class="avatar avatar-xl clickable" on:click={avatarClick} class:dim>
    <img src={image} alt={name} />
  </figure>
{:else}
  <figure class="avatar avatar-xl clickable" data-initial="{name.slice(0,1)}" on:click={avatarClick} class:dim></figure>
{/if}
