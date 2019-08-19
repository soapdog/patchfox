<script>
  const Menu = require("./Menu.svelte");
  const IdentityAndConnection = require("./IdentityAndConnection.svelte");
  const DisplayPreferences = require("./DisplayPreferences.svelte");
  const Filters = require("./Filters.svelte");
  const ContentWarnings = require("./ContentWarnings.svelte");

  const views = {
    identityAndConnection: IdentityAndConnection,
    displayPreferences: DisplayPreferences,
    filters: Filters,
    contentWarnings: ContentWarnings
  };

  let currentView = "contentWarnings";

  const handleMenuChange = ev => {
    currentView = ev.detail.currentView;
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
    <Menu {currentView} on:message={handleMenuChange} />
  </div>
  <div class="column">
    <svelte:component this={views[currentView]} />
  </div>
</div>
