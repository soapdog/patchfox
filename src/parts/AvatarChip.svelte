<script>
  import { createEventDispatcher } from "svelte";
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

  function avatarClick() {
    dispatch("avatarClick", {
      feed,
      name
    });
  }
</script>

{#if image}
  <div class="chip" on:click={avatarClick}>
    <img src={image} class="avatar avatar-sm" />
     {name}
  </div>
{:else}
  <span class="chip" on:click={avatarClick}> {name} </span>
{/if}
