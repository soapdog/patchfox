<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let subView = "";

  const setView = subView => {
    dispatch("message", {
      subView
    });
  };
</script>

<ul class="menu">
  <li class="divider" data-content="GENERAL" />
  <li class="menu-item">
    <a
      href="#/settings"
      on:click={() => setView('about')}
      class:active={subView === 'about'}>
      About Patchfox
    </a>
  </li>
  <li class="menu-item">
    <a
      href="#/settings"
      on:click={() => setView('identityAndConnection')}
      class:active={subView === 'identityAndConnection'}>
      Identity &amp; Connection
    </a>
  </li>
  <li class="menu-item">
    <a
      href="#/settings"
      on:click={() => setView('displayPreferences')}
      class:active={subView === 'displayPreferences'}>
      Display Preferences
    </a>
  </li>
  <li class="divider" data-content="ABUSE PREVENTION" />
  <li class="menu-item">
    <a
      href="#/settings"
      on:click={() => setView('filters')}
      class:active={subView === 'filters'}>
      Filters
    </a>
  </li>
  <!-- <li class="menu-item">
    <a
      href="#/settings"
      on:click={() => setView('contentWarnings')}
      class:active={subView === 'contentWarnings'}>
      Content Warnings
    </a>
  </li>
  <li class="divider" data-content="ADITIONAL PLATFORMS" />
  <li class="menu-item">
    <a
      href="#/settings"
      on:click={() => setView('platformDAT')}
      class:active={subView === 'platformDAT'}>
      DAT
    </a>
  </li>
  <li class="menu-item">
    <a
      href="#/settings"
      on:click={() => setView('platformIPFS')}
      class:active={subView === 'platformIPFS'}>
      IPFS
    </a>
  </li> -->
</ul>
