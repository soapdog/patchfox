<script>
  const { createEventDispatcher } = require("svelte");

  export let feed;

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
    dispatch("avatarClick", { feed, name });
  };
</script>

<style>
  .clickable:hover {
    cursor: pointer;
  }

  .fix {
    object-fit: cover;
  }
</style>

{#if image}
  <a
    href={patchfox.url('contacts', 'profile', { feed })}
    class="chip clickable"
    on:click|preventDefault|stopPropagation={avatarClick}>
    <img src={image} class="fix avatar avatar-sm" alt={name} />
    {name}
  </a>
{:else}
  <a
    href={patchfox.url('contacts', 'profile', { feed })}
    class="chip clickable"
    on:click|preventDefault|stopPropagation={avatarClick}>
    {name}
  </a>
{/if}
