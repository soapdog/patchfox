<script>
    const _ = require("lodash");
    const popState = () => {
    };

    const handleUncaughtException = () => {
    };

    const hashChange = () => {
    };

    let systemPackages = patchfox.systemPackages();
    let useShortColumn = true;
    let currentView = false;

    patchfox.listen("package:go", (event, {pkg, view, data}) => {
                console.log("data", data)
                if (patchfox.packages[pkg]) {
                    let packageToOpen = patchfox.packages[pkg];
                    if (typeof view !== "undefined") {
                        if (typeof packageToOpen[view] !== "undefined") {
                            currentView = packageToOpen[view];
                            patchfox.emit("package:changed", packageToOpen);
                        } else {
                            throw `Package error: Package ${pkg} has no view named: ${view}.`;
                        }
                    } else if (typeof packageToOpen.view !== "undefined") {
                        // opening default view
                        currentView = packageToOpen.view;
                        patchfox.emit("package:changed", packageToOpen);
                    } else {
                        // package is not a viewable package.
                        throw `Package error: Package ${pkg} doesn't contain a default view and can't be shown`;
                    }
                } else {
                    throw `Package error: No package with name ${pkg}.`
                }
            }
    )
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
        on:hashchange={hashChange}/>

    <div class="root wm-backdrop">
      {#each systemPackages as pkg}
      <svelte:component this={pkg.view}/>
      {/each}
        <div id="wm-current-package" class="container">
          {#if currentView}
              <svelte:component this={currentView}/>
          {/if}
        </div>
    </div>
