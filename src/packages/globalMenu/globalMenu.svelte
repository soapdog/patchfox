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
</script>

<style>
  .main-menu {
    z-index: 999999;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>

<div class="container">
  <header class="main-menu navbar">
    <section class="navbar-section">
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
  </header>
</div>
