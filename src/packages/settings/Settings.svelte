<script>
  const Menu = require("./Menu.svelte");
  const IdentityAndConnection = require("./IdentityAndConnection.svelte");
  const DisplayPreferences = require("./DisplayPreferences.svelte");
  const Filters = require("./Filters.svelte");
  const ContentWarnings = require("./ContentWarnings.svelte");
  const PlatformDAT = require("./PlatformDAT.svelte");
  const PlatformIPFS = require("./PlatformIPFS.svelte");
  const About = require("./About.svelte");

  const views = {
    identityAndConnection: IdentityAndConnection,
    displayPreferences: DisplayPreferences,
    filters: Filters,
    contentWarnings: ContentWarnings,
    platformDAT: PlatformDAT,
    platformIPFS: PlatformIPFS,
    about: About
  };

  export let subView = "identityAndConnection";

  const handleMenuChange = ev => {
    subView = ev.detail.subView;
  };
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

<div class="columns">
  <div class="column col-auto">
    <Menu {subView} on:message={handleMenuChange} />
  </div>
  <div class="column">
    <svelte:component this={views[subView]} />
  </div>
</div>
