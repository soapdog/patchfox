<script>
  // this came from: https://codepen.io/abhishekcghosh/pen/qzmEWd
  const _ = require("lodash");
  const { onDestroy } = require("svelte");

  let menus = patchfox.menus();
  console.log("menus", menus);

  let token = patchfox.listen("menu:help:documentation", () => {
    console.log("launching docs");
    window.open("/docs/index.html");
  });

  console.log("token", token);

  onDestroy(() => {
    patchfox.stopListening(token);
  });
</script>

<nav class="flyout-nav">
  <ul>
    {#each menus as menu}
      <li>
        <a
          href="#"
          on:click={() => {
            patchfox.triggerMenu(menu);
          }}>
          <span class="global-menu-item">{menu.label}</span>
          {#if menu.shortcut}
            <span class="shortcut">{menu.shortcut}</span>
          {/if}
        </a>
        {#if typeof menu.subMenu !== 'undefined'}
          <ul>
            {#each menu.subMenu as subMenu}
              {#if typeof subMenu.label !== 'undefined'}
                <li>
                  <a
                    href="#"
                    on:click={() => {
                      console.log('trigger menu', subMenu);
                      patchfox.triggerMenu(subMenu);
                    }}>
                    <span class="global-menu-item">{subMenu.label}</span>
                    {#if subMenu.shortcut}
                      <span class="shortcut">{subMenu.shortcut}</span>
                    {/if}
                  </a>
                </li>
              {:else}
                <li class="separator" />
              {/if}
            {/each}
          </ul>
        {/if}
      </li>
    {/each}
  </ul>
</nav>
