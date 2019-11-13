<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let currentView = "";

  const setView = currentView => {
    dispatch("message", {
      currentView
    });
  };
</script>

<ul class="menu">
  <li class="divider" data-content="GENERAL" />
  <li class="menu-item">
    <a
      href="#/settings"
      on:click={() => setView('about')}
      class:active={currentView === 'about'}>
      About Patchfox
    </a>
  </li>
  <li class="menu-item">
    <a
      href="#/settings"
      on:click={() => setView('identityAndConnection')}
      class:active={currentView === 'identityAndConnection'}>
      Identity &amp; Connection
    </a>
  </li>
  <li class="menu-item">
    <a
      href="#/settings"
      on:click={() => setView('displayPreferences')}
      class:active={currentView === 'displayPreferences'}>
      Display Preferences
    </a>
  </li>
  <li class="divider" data-content="ABUSE PREVENTION" />
  <li class="menu-item">
    <a
      href="#/settings"
      on:click={() => setView('filters')}
      class:active={currentView === 'filters'}>
      Filters
    </a>
  </li>
  <!-- <li class="menu-item">
    <a
      href="#/settings"
      on:click={() => setView('contentWarnings')}
      class:active={currentView === 'contentWarnings'}>
      Content Warnings
    </a>
  </li>
  <li class="divider" data-content="ADITIONAL PLATFORMS" />
  <li class="menu-item">
    <a
      href="#/settings"
      on:click={() => setView('platformDAT')}
      class:active={currentView === 'platformDAT'}>
      DAT
    </a>
  </li>
  <li class="menu-item">
    <a
      href="#/settings"
      on:click={() => setView('platformIPFS')}
      class:active={currentView === 'platformIPFS'}>
      IPFS
    </a>
  </li> -->
</ul>
