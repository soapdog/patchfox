<script>
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let subView = ""

  const setView = subView => {
    dispatch("message", {
      subView
    })
  }
</script>

<ul class="menu menu py-3 shadow-lg bg-base-100 rounded-box">
  <li class="menu-title"><span>GENERAL</span></li>
  <li>
    <a
      href="#/settings"
      on:click={() => setView("about")}
      class:active={subView === "about"}>
      About Patchfox
    </a>
  </li>
  <li>
    <a
      href="#/settings"
      on:click={() => setView("identitiesAndConnections")}
      class:active={subView === "identitiesAndConnections"}>
      Identities &amp; Connections
    </a>
  </li>
  <li>
    <a
      href="#/settings"
      on:click={() => setView("displayPreferences")}
      class:active={subView === "displayPreferences"}>
      Display Preferences
    </a>
  </li>
  <li class="menu-title"><span>ABUSE PREVENTION</span></li>
  <li>
    <a
      href="#/settings"
      on:click={() => setView("filters")}
      class:active={subView === "filters"}>
      Filters
    </a>
  </li>
  <!-- <li>
    <a
      href="#/settings"
      on:click={() => setView('contentWarnings')}
      class:active={subView === 'contentWarnings'}>
      Content Warnings
    </a>
  </li>
  <li class="divider" data-content="ADITIONAL PLATFORMS" />
  <li>
    <a
      href="#/settings"
      on:click={() => setView('platformDAT')}
      class:active={subView === 'platformDAT'}>
      DAT
    </a>
  </li>
  <li>
    <a
      href="#/settings"
      on:click={() => setView('platformIPFS')}
      class:active={subView === 'platformIPFS'}>
      IPFS
    </a>
  </li> -->
</ul>
