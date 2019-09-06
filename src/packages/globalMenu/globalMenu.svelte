<script>
    // this came from: https://codepen.io/abhishekcghosh/pen/qzmEWd

    let menus = patchfox.menus();
    let groups = patchfox.menuGroups();
    let groupKeys = Object.keys(groups);
    console.log("groups", groups);
</script>

<nav class="flyout-nav">
    <ul>
      {#each groupKeys as key}
          <li>
              <a href="#">
                  <span class="global-menu-item">{key}</span>
              </a>
              <ul>
                {#each groups[key] as menu, i}
                  {#each menu.items as item}
                      <li>
                          <a
                            on:click={() => {
                            console.log('trigger menu', item);
                            patchfox.triggerMenu(item);
                          }}>
                              <span class="global-menu-item">{item.label}</span>
                              {#if item.shortcut}
                              <span class="shortcut">{item.shortcut}</span>
                              {/if}
                          </a>
                      </li>
                  {/each}
                  {#if i < groups[key].length - 1}
                  <li class="separator"></li>
                  {/if}
                {/each}
              </ul>
          </li>
      {/each}
    </ul>
</nav>
