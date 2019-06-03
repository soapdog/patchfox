<script>
  import { DriverHermiebox } from "./driver-hermiebox.js";
  import { onMount } from "svelte";
  import { connected, route, navigate } from "./stores.js";
  import Navigation from "./Navigation.svelte";
  import Public from "./views/Public.svelte";
  import Default from "./views/Default.svelte";
  import Compose from "./views/Compose.svelte";

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
        configurationIsMissing();
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
    window.location = "/docs/index.html#/troubleshooting";
  };

  onMount(() => {
    browser.storage.local
      .get()
      .then(configurationPresent, configurationMissing);
  });

  window.ssb = false;

  const routes = {
    "/thread": "thread",
    "/public": Public,
    "/compose": Compose,
    "*": Default
  };

  let currentView = "";

  $: {
    if ($connected) {
      let currentLocation = $route.location;

      if (routes.hasOwnProperty(currentLocation)) {
        console.log("found!", currentLocation);
        currentView = routes[currentLocation];
      } else {
        console.log("didn't find", currentLocation);
        currentView = routes["*"];
      }
      console.log(currentLocation, currentView);
    } else {
      currentView = Default
    }
  }

  const changedRoute = event => {
    console.log("hash", event);
    navigate(location.hash.slice(1));
  };
</script>

<svelte:window on:hashchange={changedRoute} />
<div class="container bg-gray">
  <Navigation />
  <svelte:component this={currentView} />
</div>
