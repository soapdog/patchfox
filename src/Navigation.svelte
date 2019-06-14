<script>
  import { connected, navigate, routeLocation } from "./utils.js";

  let avatar = "/images/icon.png";

  $: if ($connected) {
    ssb.avatar(ssb.feed).then(data => {
      avatar = `http://localhost:8989/blobs/get/${data.image}`;
    });
  }

  const goSettings = ev => {
    browser.runtime.openOptionsPage();
  };

  const goCompose = () => navigate("/compose")
  const goPublic = () => navigate("/public")

  const openSidebar = async ev => {
    let loc = window.location.href;
    browser.sidebarAction.setPanel({ panel: loc });
    browser.sidebarAction.open();
    let tab = await browser.tabs.getCurrent();
    await browser.tabs.remove(tab.id);
  };

  const closeSidebar = async ev => {
    let loc = await browser.sidebarAction.getPanel({});
    await browser.tabs.create({ url: loc });
    await browser.sidebarAction.close();
  };

const openMyProfile = ev => {
  ev.stopPropagation();
  ev.preventDefault();

  if (ssb.feed) {
    navigate("/profile", {feed: ssb.feed})
  }
}
</script>

<style>
  .blocker {
    height: 70px;
    display: block;
  }

  .above {
    z-index: 99999;
    width: 100;
    padding: 5px;
    position: fixed;
  }

  .current {
    border: none;
    background: none;
    border-bottom: solid 2px rgb(2, 146, 50);
    outline: none;
  }
</style>

<header class="navbar">
  <section class="navbar-section hide-sm">
    <a href="#/sidebar" class="btn btn-link" on:click={openSidebar}>
      <i class="icon icon-minus text-black" />
    </a>
    <a href="#" class="navbar-brand mr-2 p-1" on:click={openMyProfile}>
      <figure class="avatar avatar-lg">
        <img src={avatar} alt="L" />
        <i class="avatar-presence {$connected ? 'online' : 'offline'}" />
      </figure>
    </a>
    <a
      href="#/compose"
      class="btn btn-link"
      class:current={$routeLocation == "/compose"}
      on:click|stopPropagation|preventDefault={goCompose}>
      New
    </a>
    <a
      href="#/public"
      class="btn btn-link"
      class:current={$routeLocation == "/public"}
      on:click|stopPropagation|preventDefault={goPublic}>
      Public
    </a>
    <a href="#/settings" class="btn btn-link" on:click={goSettings}>Settings</a>
    <a href="/docs/index.html" class="btn btn-link">Help</a>
  </section>
  <section class="navbar-section show-sm bg-gray above">
    <a href="..." class="navbar-brand mr-2 p-1">
      <figure class="avatar">
        <img src={avatar} alt="L" />
        <i class="avatar-presence {$connected ? 'online' : 'offline'}" />
      </figure>
    </a>
    <div class="dropdown float-right">
      <a
        href="?"
        class="btn btn-link dropdown-toggle"
        tabindex="0"
        on:click|stopPropagation|preventDefault={() => ""}>
        Menu
        <i class="icon icon-caret" />
      </a>
      <!-- menu component -->
      <ul class="menu">
        <li class="menu-item">
          <a href="#/compose" class="btn btn-link">New</a>
        </li>
        <li class="menu-item">
          <a href="#/public" class="btn btn-link">Public</a>
        </li>
        <li class="menu-item">
          <a href="#/settings" class="btn btn-link" on:click={goSettings}>
            Settings
          </a>
        </li>
        <li class="menu-item">
          <a href="/docs/index.html" class="btn btn-link">Help</a>
        </li>
        <li class="menu-item">
          <a href="#/sidebar" class="btn btn-link" on:click={closeSidebar}>
            Open as a Tab
          </a>
        </li>
      </ul>
    </div>
  </section>
  <div class="blocker show-sm" />
</header>
