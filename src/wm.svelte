<script>
  const _ = require("lodash");
  const { getPref } = require("./core/kernel/prefs.js");
  const { tick } = require("svelte");
  const queryString = require("query-string");

  let systemPackages = patchfox.systemPackages();
  let useShortColumn = true;
  let currentView = false;
  let currentPackage = false;
  let args = {};

  patchfox.listen("package:changed", (event, data) => {
    console.log(event, data);
  });

  const goPackage = ({ pkg, view, data }) => {
    try {
      let packageToOpen = patchfox.packages[pkg];
      let viewToOpen = view ? packageToOpen[view] : packageToOpen.view;
      let eventToSend = view
        ? `package:activate:${pkg}:${view}`
        : `package:activate:${pkg}:view`;

      currentView = false;
      args = {};

      // normal package
      if (packageToOpen && viewToOpen) {
        args = data;
        currentPackage = packageToOpen;
        currentView = viewToOpen;
        patchfox.emit("package:changed", { packageToOpen, view, data });
        patchfox.emit(eventToSend, data);
        return true;
      }
    } catch (e) {
      throw `Can't go to package ${pkg} and view ${view}`;
      return false;
    }
  };

  const popState = ev => {
    if (ev.state !== null) {
      goPackage(ev.state);
    }
  };

  const handleUncaughtException = n => {
    goPackage({
      pkg: "errorHandler",
      data: {
        currentPackage,
        error: n
      }
    });
  };

  patchfox.listen("package:go", (event, { pkg, view, data }) => {
    if (typeof data === "undefined") {
      data = {};
    }
    let state = { pkg, view, ...data };
    let qs = queryString.stringify(state);
    history.pushState({ pkg, view, data }, "", `/index.html?${qs}`);
    goPackage({ pkg, view, data });
  });

  patchfox.listen("package:save:state", (event, { pkg, view, data }) => {
    if (typeof data === "undefined") {
      data = {};
    }

    let state = { pkg, view, ...data };
    let qs = queryString.stringify(state);
    history.pushState({ pkg, view, data }, "", `/index.html?${qs}`);
  });

  let qs = queryString.parse(location.search);
  let pkg = qs.pkg || getPref("default-package", "hub");
  let view = qs.view ? qs.view : "view";
  delete qs.pkg;
  delete qs.view;
  patchfox.go(pkg, view, qs);
</script>

<style>
  .wm-current-package-container {
    max-width: 840px;
    margin: auto;
    padding-top: 10px;
  }

   .wm-current-app-container {
    margin: auto;
    padding-top: 60px;
  }

  .wm-backdrop {
    width: 100%;
    height: 100%;
    min-height: 100vh;
  }
</style>

<svelte:window on:popstate={popState} on:error={handleUncaughtException} />

<div class="root wm-backdrop">
  {#each systemPackages as pkg}
    <svelte:component this={pkg.view} />
  {/each}
  {#if currentPackage.app}
    <div class="container wm-current-app-container">
      <svelte:component this={currentView} {...args} />
    </div>
  {:else}
    <div class="container wm-current-package-container">
      <div
        id="wm-current-package"
        class="cyberpunk-container"
        augmented-ui="tr-clip-x br-clip-x exe">
        {#if currentView}
          <svelte:component this={currentView} {...args} />
        {/if}
      </div>
    </div>
  {/if}
</div>
