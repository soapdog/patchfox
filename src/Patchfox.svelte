<script>
  import { DriverHermiebox } from "./driver-hermiebox.js";
  import { onMount } from "svelte";
  import { connected, route, navigate, currentView } from "./utils.js";
  import Navigation from "./Navigation.svelte";

  const configurationIsOK = savedData => {
    return (
      savedData.hasOwnProperty("keys") ||
      savedData.hasOwnProperty("keys") ||
      savedData.hasOwnProperty("keys")
    );
  };

  const connectAndLaunch = savedData => {
    window.ssb = new DriverHermiebox();

    ssb
      .connect(savedData.keys)
      .then(data => {
        console.log("connected");
        connected.set(true);
      })
      .catch(err => {
        console.error("can't connect", err);
        cantConnect();
      });
  };

  const configurationPresent = savedData => {
    if (!configurationIsOK(savedData)) {
      configurationMissing();
    } else {
      connectAndLaunch(savedData);
    }
  };

  const configurationMissing = () => {
    console.log("config missing");
    window.location = "/docs/index.html#/troubleshooting/no-configuration";
  };

  const cantConnect = () => {
    console.log("config missing");
    window.location = "/docs/index.html#/troubleshooting/no-connection";
  };

  onMount(() => {
    browser.storage.local
      .get()
      .then(configurationPresent, configurationMissing);
  });

  window.ssb = false;

  const popState = event => {
    if (event.state !== null) {
      console.dir("pop", event.state);
      let { location, data } = event.state;
      route.set({ location, data });
    }
  };

  const handleUncaughtException = event => {
    console.error("Uncaught exception", event);
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
