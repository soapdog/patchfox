<script>
  export let filter;
  export let reverse = false;
  export let map = null; 
  export let reduce = null;
  export let limit = false;

  let promise = ssb.query(filter, reverse, map, reduce, limit);
</script>

{#await promise}
  <div class="loading"/>
{:then msgs}
  {#each msgs as msg}
    <slot {msg} />
  {/each}
{/await}
