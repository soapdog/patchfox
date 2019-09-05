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

  .wm-backdrop {
    background-image: url("/images/bg.jpg");
    background-size: cover;
    width: 100vw;
    height: 100vh;
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
  <div id="wm-current-package">
    <!-- <svelte:component this={$currentView} /> -->
  </div>
</div>
