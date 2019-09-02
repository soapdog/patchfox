<script>
const popState = () => {};

const handleUncaughtException = () => {};

const hashChange = () => {};

const Launcher = patchfox.packages.launcher;
const LauncherView = Launcher.view

let useShortColumn = true;

</script>

<style>
  .reduced-line-length {
    max-width: 840px;
    margin: auto;
  }
</style>

<svelte:window
  on:popstate={popState}
  on:error={handleUncaughtException}
  on:hashchange={hashChange} />

<div class="root">
  <LauncherView />
  <div class="wm-backdrop">
    <div class="wm-current-package" class:reduced-line-length={useShortColumn}>
      <!-- <svelte:component this={$currentView} /> -->
    </div>
  </div>
</div>