<script>
  const { createEventDispatcher } = require("svelte")

  export let label
  export let icon = false
  export let link

  const dispatch = createEventDispatcher()

  const click = () => {
    dispatch("click")
  }
</script>

<li class="cursor-pointer">
  <a href={link} on:click|preventDefault={click} target="_blank">
    {#if icon}
      <i class="fas fa-{icon}" />&nbsp;&nbsp;
    {/if}
    {label}
  </a>
</li>
