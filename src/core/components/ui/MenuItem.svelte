<script>
  const { createEventDispatcher } = require("svelte");

  export let label;
  export let icon = false;
  export let link;

  const dispatch = createEventDispatcher();

  const click = () => {
      dispatch("click")
  }
</script>

<style>
.menu-item {
    cursor: pointer;
}
</style>

<li class="menu-item">
  <a href={link} on:click|preventDefault={click} target="_blank">
    {#if icon}
      <i class="icon icon-{icon}" />
    {/if}
    {label}
  </a>
</li>
