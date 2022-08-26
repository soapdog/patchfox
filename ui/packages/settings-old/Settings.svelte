<script>
  import Menu from "./Menu.svelte"
  import IdentitiesAndConnections from "./IdentitiesAndConnections.svelte"
  import DisplayPreferences from "./DisplayPreferences.svelte"
  import Filters from "./Filters.svelte"
  import ContentWarnings from "./ContentWarnings.svelte"
  import PlatformDAT from "./PlatformDAT.svelte"
  import PlatformIPFS from "./PlatformIPFS.svelte"
  import About from "./About.svelte"

  const views = {
    identitiesAndConnections: IdentitiesAndConnections,
    displayPreferences: DisplayPreferences,
    filters: Filters,
    contentWarnings: ContentWarnings,
    platformDAT: PlatformDAT,
    platformIPFS: PlatformIPFS,
    about: About,
  }

  export let subView = "identitiesAndConnections"

  if (!views.hasOwnProperty(subView)) {
    console.log("no such subview", subView)
    subView = "about"
  }

  const handleMenuChange = ev => {
    subView = ev.detail.subView
  }
</script>

<style>
  .filter {
    height: 300px;
    margin-bottom: 0.4rem;
    overflow: hidden;
  }

  .feed {
    max-width: 100%;
    overflow: hidden;
  }
</style>

<div class="flex gap-4">
  <div class="flex-none">
    <Menu {subView} on:message="{handleMenuChange}" />
  </div>
  <div class="flex-1 p-4 rounded-box shadow bg-base-100">
    <svelte:component this="{views[subView]}" />
  </div>
</div>
