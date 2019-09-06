<script>
    let groups = patchfox.menuGroups();
    let groupKeys = Object.keys(groups);
    console.log("groups", groups);
    let currentPackage = false;

    patchfox.listen("package:changed", (event, pkg) => {
        currentPackage = pkg.title || pkg.name || false;
    })
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
                  <a href="#/compose" class="btn btn-link dropdown-toggle" tabindex="0">
                    {key}
                      <i class="icon icon-caret"/>
                  </a>
                  <ul class="menu">
                    {#each groups[key] as menu, i}
                      {#each menu.items as item}
                          <li class="menu-item">
                              <a
                                      href="#"
                                      class="btn btn-link"
                                      on:click|stopPropagation|preventDefault={() => {
                          console.log('trigger menu', item);
                          patchfox.triggerMenu(item);
                          }}>
                              {item.label}
                                      </a>
                          </li>
                      {/each}
                    {/each}
                  </ul>
              </div>
          {/each}
        </section>
    </header>
</div>
