<script>
  import { onMount } from "svelte";
  import { connected, route, navigate, currentView, connect } from "./utils.js";
  import Navigation from "./Navigation.svelte";

  window.ssb = false;

  onMount(() => {
    connect();
  });

  const popState = event => {
    if (event.state !== null) {
      console.dir("pop", event.state);
      let { location, data } = event.state;
      route.set({ location, data });
    }
  };

  const handleUncaughtException = event => {
    console.error("Uncaught exception", event);
    navigate("/error", {error: event.message})
  };

  const hashChange = event => {
    console.dir("hash change", event);
  };
</script>

<svelte:window
  on:popstate={popState}
  on:error={handleUncaughtException}
  on:hashchange={hashChange} />
<div class="container bg-gray">
  <Navigation />
  <svelte:component this={$currentView} />
</div>
