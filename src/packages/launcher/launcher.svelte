<script>
  const { onDestroy } = require("svelte")
  const keymage = require("keymage")

  export let active = false

  export let subView = "Apps"
  let packageBeingHovered = false
  let description = ""
  let descriptionOpen = false
  let selectedPackage = false

  let packageKeys = []

  let removeHotKey = keymage(
    "ctrl-m",
    () => {
      keymage.pushScope("launcher")
      active = !active
    },
    { preventDefault: true }
  )

  const iconForPackage = pkg => {
    let icon = "/images/package.svg"
    if (patchfox.packages[pkg].icon) {
      icon = `/packages/${pkg}/${patchfox.packages[pkg].icon}`
    }
    return icon
  }

  const titleForPackage = pkg => {
    let name = patchfox.packages[pkg]?.title || patchfox.packages[pkg].name
    return name
  }

  const descriptionForPackage = pkg => {
    let description = patchfox.packages[pkg].description || false
    return description
  }

  const urlForPackage = pkg => {
    let url = `?pkg=${pkg}`
    return url
  }

  const filter = key => {
    switch (key) {
    case "All Packages":
      packageKeys = Object.keys(patchfox.packages)
      break
    case "Apps":
      packageKeys = Object.keys(patchfox.packages).filter(pkg => {
        return (
          patchfox.packages[pkg].app && patchfox.packages[pkg].app === true
        )
      })
      break
    default:
      packageKeys = []
    }
    subView = key
  }

  onDestroy(() => {
    keymage.popScope("launcher")
    removeHotKey()
    patchfox.stopListening(token)
  })

  const token = patchfox.listen("launcher:open", () => {
    active = true
    console.log("open launcher")
  })
  filter(subView)
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
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .package-title {
    text-transform: capitalize;
  }

  .package-icon img {
    width: 42px;
  }
</style>

<div class:modal-open={active} class="modal">
  <div class="modal-box w-11/12 max-w-5xl">
    <a
    href="#close"
    class="modal-overlay"
    aria-label="Close"
    on:click={() => (active = false)} />
    <div class="modal-container">
      <div class="modal-header">
        <a
        href="#close"
        class="btn btn-ghost float-right"
        aria-label="Close"
        on:click={() => (active = false)}><i class="fas fa-times" /></a>
        <h1 class="uppercase font-medium text-center mb-4">Launcher</div>
      </div>
      <div class:hidden={descriptionOpen}>
      <div class="tabs tabs-boxed mb-4">
            <a
            class="tab"
            href="#"
            class:tab-active={subView == "Apps"}
            on:click={() => filter("Apps")}>
            Apps
          </a>
          <a
          class="tab"
          href="#"
          class:tab-active={subView == "All Packages"}
          on:click={() => filter("All Packages")}>
          All Packages
        </a>
    </div>
    <div class="grid">
      {#each packageKeys as pkg}
      <div
      class="package c-hand"
      class:tooltip={descriptionForPackage(pkg)}
      data-tooltip={descriptionForPackage(pkg)}
      on:click={() => {
        if (patchfox.packages[pkg]?.app) {
          active = false
          patchfox.go(pkg, "view")
        } else {
          selectedPackage = pkg 
          descriptionOpen = true
        }
      }}>
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
    {:else}
    <p>No packages matching the {subView} filter</p>
    {/each}
  </div>
  </div>
  <div class:hidden={!descriptionOpen}>
    {#if selectedPackage}
    <div class="package-icon">
        <img
        class="centered"
        src={iconForPackage(selectedPackage)}
        alt={titleForPackage(selectedPackage)} />
    </div>
      <div class="package-content">
        <div class="package-title" href={urlForPackage(selectedPackage)}>
          <h2 class="text-xl">{titleForPackage(selectedPackage)}</h2>
        </div>
      </div>
      <p>
        Open
        <a class="link link-accent" target="_blank" href="/docs/index.html#/packages/{selectedPackage}/">
          {titleForPackage(selectedPackage)} documentation
        </a>
      </p>
      <br>
      <p>Do you want to see the source-code for this package?</p>
      <br>
      <ul>
        <li>
          <a class="link" target="_blank" href="https://github.com/soapdog/patchfox/blob/master/src/packages/{selectedPackage}/">
            See source for <b>{selectedPackage} package</b> at GitHub.
          </a>
        </li>
        <li>
          <a class="link" target="_blank" href="https://git.sr.ht/~soapdog/patchfox/tree/master/item/src/packages/{selectedPackage}/">
            See source for <b>{selectedPackage} package</b> at SourceHut.
          </a>
        </li>
      </ul>
      <br>
      <p><a class="btn btn-primary" on:click={() => descriptionOpen = false}>Close</a>
    {/if}
  </div>

</div>
</div>
