<script>
export let blur = false;
export let border = false;
export let short = false;
</script>

<style>
 .blur img {
    filter: blur(20px) !important;
  }

  .blur {
    border: solid 2px red;
  }

  
  .border {
    border: solid 2px orange;
  }
</style>

<div class="card m-2" class:blur class:border>
  <div class="card-image">
    <slot name="card-image" />
  </div>
  <div class="card-header">
    <slot name="card-header" />
  </div>
  {#if !short}
  <div class="card-body">
    <slot name="card-body" />
  </div>
  <div class="card-footer">
    <slot name="card-footer" />
  </div>
  {/if}
</div>
