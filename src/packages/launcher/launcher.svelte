<script>
  const { onDestroy } = require("svelte");

  export let active = false;

  let packageKeys = Object.keys(patchfox.packages).filter(pkg => {
    return patchfox.packages[pkg].hasOwnProperty("view");
  });

  let removeHotKey = keymage(
    "ctrl-m",
    () => {
      keymage.pushScope("launcher");
      active = !active;
    },
    { preventDefault: true }
  );

  const iconForPackage = pkg => {
    let icon = patchfox.packages[pkg].icon || "/images/package.svg";
    return icon;
  };

  const titleForPackage = pkg => {
    let name = patchfox.packages[pkg].title || patchfox.packages[pkg].name;
    return name;
  };

  const urlForPackage = pkg => {
    let url = `?pkg=${pkg}`;
    return url;
  };

  onDestroy(() => {
    keymage.popScope("launcher");
    removeHotKey();
  });
</script>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    grid-auto-rows: auto;
    grid-gap: 1rem;
  }
  .package {
    border-radius: 4px;
    padding: 0.5rem;
    text-align: center;
  }

  .package-title {
    text-transform: capitalize;
  }
</style>

<div class:active class="modal modal-lg">
  <a href="#close" class="modal-overlay" aria-label="Close" />
  <div class="modal-container">
    <div class="modal-header">
      <a href="#close" class="btn btn-clear float-right" aria-label="Close" />
      <div class="modal-title h5">Packages</div>
    </div>
    <div class="modal-body">
      <div class="grid">
        {#each packageKeys as pkg}
          <div class="package">
            <div class="package-icon">
              <img
                class="centered"
                src={iconForPackage(pkg)}
                alt={titleForPackage(pkg)} />
            </div>
            <div class="package-content">
              <div class="package-title" href={urlForPackage(pkg)}>
                {titleForPackage(pkg)}
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
    <div class="modal-footer">...</div>
  </div>
</div>
