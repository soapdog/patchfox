<script>
  import { onMount, onDestroy } from "svelte";
  import {
    connected,
    route,
    navigate,
    currentView,
    connect,
    reconnect,
    getPref
  } from "./utils.js";
  import Navigation from "./Navigation.svelte";

  let useShortColumn = getPref("columnSize", "short") == "short";

  const popState = event => {
    if (event.state !== null) {
      console.dir("pop", event.state);
      let { location, data } = event.state;
      route.set({ location, data });
    }
  };

  const handleUncaughtException = event => {
    console.error("Uncaught exception", event);
    navigate("/error", { error: event.message });
  };

  const hashChange = event => {
    console.dir("hash change", event);
  };
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
<div class="container bg-gray">
  <div class="columns">
    <div class="column" class:reduced-line-length={useShortColumn}>
      <Navigation />
      <svelte:component this={$currentView} />
    </div>
  </div>
</div>
