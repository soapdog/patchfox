<script>
  const queryString = require("query-string");

  let groups = patchfox.menuGroups();
  let groupKeys = Object.keys(groups);
  let currentPackage = false;

  patchfox.listen("package:changed", (event, pkg) => {
    currentPackage = pkg.title || pkg.name || false;
  });

  const menuItemToURL = ({ pkg, view, data }) => {
    let state = { pkg, view, ...data };
    let qs = queryString.stringify(state);
    return qs;
  };

  let query = "";
  const search = ev => {
    patchfox.go("search", "query", { query });
  };

  
  const openSidebar = async ev => {
    let loc = window.location.href;
    browser.sidebarAction.setPanel({ panel: loc });
    browser.sidebarAction.open();
  };

  const closeSidebar = async ev => {
    let loc = await browser.sidebarAction.getPanel({});
    await browser.tabs.create({ url: loc });
    await browser.sidebarAction.close();
  };

</script>

<style>
  .main-menu {
    z-index: 999999;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding-left: 10;
    padding-right: 10;
  }
</style>

<div class="container">
  <header class="main-menu navbar hide-sm ">
    <section class="navbar-section">
    <a href="#" class="btn btn-link" on:click={openSidebar}><i class="icon icon-arrow-left"></i></a>
      {#each groupKeys as key}
        <div class="dropdown">
          <a href="#" class="btn btn-link dropdown-toggle" tabindex="0">
            {key}
            <i class="icon icon-caret" />
          </a>
          <ul class="menu">
            {#each groups[key] as menu, i}
              {#if menu.label}
                <li class="divider" data-content={menu.label} />
              {/if}
              {#each menu.items as item}
                <li class="menu-item">
                  {#if item.event === 'package:go'}
                    <a
                      href="?{menuItemToURL(item.data)}"
                      class="btn btn-link"
                      on:click|stopPropagation|preventDefault={() => {
                        patchfox.triggerMenu(item);
                      }}>
                      {item.label}
                    </a>
                  {:else}
                    <a
                      class="btn btn-link"
                      href="?{menuItemToURL(item.data)}"
                      on:click|stopPropagation|preventDefault={() => {
                        patchfox.triggerMenu(item);
                      }}>
                      {item.label}
                    </a>
                  {/if}
                </li>
              {/each}
            {/each}
          </ul>
        </div>
      {/each}
    </section>
    <section class="navbar-center">
      <!-- centered logo or brand -->
    </section>
    <section class="navbar-section">
      <div class="input-group input-inline p-2">
        <input
          class="form-input"
          type="text"
          bind:value={query}
          placeholder="search" />
        <button class="btn btn-primary input-group-btn" on:click={search}>
          Search
        </button>
      </div>
    </section>
  </header>
  <header class="main-menu show-sm">
    <div class="dropdown">
      <a href="#" class="btn btn-link dropdown-toggle" tabindex="0">
        menu
        <i class="icon icon-caret" />
      </a>
      <!-- menu component -->
      <ul class="menu">
        {#each groupKeys as key}
          <li class="divider" data-content={key} />
          {#each groups[key] as menu, i}
            {#each menu.items as item}
              <li class="menu-item">
                {#if item.event === 'package:go'}
                  <a
                    href="?{menuItemToURL(item.data)}"
                    class="btn btn-link"
                    on:click|stopPropagation|preventDefault={() => {
                      patchfox.triggerMenu(item);
                    }}>
                    {item.label}
                  </a>
                {:else}
                  <a
                    class="btn btn-link"
                    href="?{menuItemToURL(item.data)}"
                    on:click|stopPropagation|preventDefault={() => {
                      patchfox.triggerMenu(item);
                    }}>
                    {item.label}
                  </a>
                {/if}
              </li>
            {/each}
          {/each}
        {/each}
      </ul>
    </div>
  </header>
</div>
