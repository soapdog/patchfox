<script>
  import { onMount, onDestroy } from "svelte";
  import {
    connected,
    route,
    navigate,
    currentView,
    connect,
    reconnect
  } from "./utils.js";
  import Navigation from "./Navigation.svelte";

  window.ssb = false;

  let interval;

  onMount(() => {
    connect();

    interval = setInterval(() => {
      if (hermiebox.sbot) {
        hermiebox.sbot.whoami((err, v) => {
          if (err) {
            console.error("can't call whoami", err);
            reconnect().catch(n => {
              console.error("can't reconnect");
              clearInterval(interval);
              navigate("/error", { error: n });
            });
          }
        });
      }
    }, 5000);
  });

  onDestroy(() => clearInterval(interval));

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
    <div class="column reduced-line-length">
      <Navigation />
      <svelte:component this={$currentView} />
    </div>
  </div>
</div>
