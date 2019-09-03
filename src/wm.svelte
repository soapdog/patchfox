<script>
  const _ = require("lodash");
  const popState = () => {};

  const handleUncaughtException = () => {};

  const hashChange = () => {};

  let systemPackages = patchfox.systemPackages();
  let useShortColumn = true;
</script>

<style>
  .reduced-line-length {
    max-width: 840px;
    margin: auto;
  }

  .wm-current-package {
    border: solid 4px blue;
  }
</style>

<svelte:window
  on:popstate={popState}
  on:error={handleUncaughtException}
  on:hashchange={hashChange} />

<div class="root wm-backdrop">
  {#each systemPackages as pkg}
    <svelte:component this={pkg.view} />
  {/each}
  <div class="wm-current-package">
    <!-- <svelte:component this={$currentView} /> -->
  </div>
</div>
