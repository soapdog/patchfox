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

  const goPackage = async ({ pkg, view, data }) => {
    currentView = false;
    args = {};

    await tick();

    // if () //todo: broken

    if (typeof patchfox.packages[pkg] !== "undefined") {
      let packageToOpen = patchfox.packages[pkg];
      if (typeof view !== "undefined") {
        if (typeof packageToOpen[view] !== "undefined") {
          args = data;
          currentPackage = packageToOpen;
          currentView = packageToOpen[view];
          patchfox.emit("package:changed", { packageToOpen, view, data });
          return true;
        } else {
          throw `Package error: Package ${pkg} has no view named: ${view}.`;
          return false;
        }
      } else if (typeof packageToOpen.view !== "undefined") {
        // opening default view
        args = data;
        currentPackage = packageToOpen;
        currentView = packageToOpen.view;
        patchfox.emit("package:changed", { packageToOpen, view, data });
        return true;
      } else {
        // package is not a viewable package.
        throw `Package error: Package ${pkg} doesn't contain a default view and can't be shown`;
        return false;
      }
    } else {
      throw `Package error: No package with name ${pkg}.`;
      return false;
    }
  };

  const popState = ev => {
    if (ev.state !== null) {
      console.log("pop!");
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

  let qs = queryString.parse(location.search);
  let pkg = qs.pkg || getPref("default-package", "hub");
  let view = qs.view;
  delete qs.pkg;
  delete qs.view;
  console.log("go from URL");
  patchfox.go(pkg, view, qs);
</script>

<style>
  .reduced-line-length {
    max-width: 840px;
    margin: auto;
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
  <div class="container reduced-line-length">
    <div
      id="wm-current-package"
      class="cyberpunk-container"
      augmented-ui="tr-clip-x br-clip-x exe">
      {#if currentView}
        <svelte:component this={currentView} {...args} />
      {/if}
    </div>

  </div>
</div>
