<script>
  const { connected, navigate, routeLocation, intercept } = require("./utils.js");

  let avatar = "/images/icon.png";

  let query = "";

  $: if ($connected) {
    ssb.avatar(ssb.feed).then(data => {
      avatar = `http://localhost:8989/blobs/get/${data.image}`;
    });
  }

  const goSettings = ev => navigate("/settings");
  const goCompose = () => navigate("/compose/post");
  const goComposeBlog = () => navigate("/compose/blog");
  const goPublic = () => navigate("/public");
  const goChannels = () => navigate("/channels");
  const goMentions = () => navigate("/mentions");

  const goSearch = () => {
    navigate("/intercept", { query });
    intercept();
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

  const openMyProfile = ev => {
    ev.stopPropagation();
    ev.preventDefault();

    if (ssb.feed) {
      navigate("/profile", { feed: ssb.feed });
    }
  };
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
    <div class="dropdown">
      <a href="#" class="btn btn-link dropdown-toggle" tabindex="0">
        Compose
        <i class="icon icon-caret" />
      </a>
      <ul class="menu">
        <li class="menu-item">
          <a
            href="#/compose/post"
            class="btn btn-link"
            on:click|stopPropagation|preventDefault={goCompose}>
            New Post
          </a>
        </li>
        <li class="menu-item">
          <a
            href="#/compose/blog"
            class="btn btn-link"
            on:click|stopPropagation|preventDefault={goComposeBlog}>
            New Blog Post
          </a>
        </li>
      </ul>
    </div>
    <a
      href="#/public"
      class="btn btn-link"
      on:click|stopPropagation|preventDefault={goPublic}>
      Public
    </a>
    <a
      href="#/mentions"
      class="btn btn-link"
      on:click|stopPropagation|preventDefault={goMentions}>
      Mentions
    </a>
    <a
      href="#/channels"
      class="btn btn-link"
      on:click|stopPropagation|preventDefault={goChannels}>
      Channels
    </a>
    <a href="#/settings" class="btn btn-link" on:click={goSettings}>Settings</a>
    <a href="/docs/index.html" class="btn btn-link">Help</a>
  </section>
  <section class="navbar-section hide-sm">
    <div class="input-group input-inline">
      <input
        class="form-input"
        type="text"
        bind:value={query}
        placeholder="Channel or Feed ID" />
      <button class="btn btn-primary input-group-btn" on:click={goSearch}>
        Go
      </button>
    </div>
  </section>
  <section class="navbar-section show-sm bg-gray above">
    <button class="btn btn-link" on:click={() => history.back()}>
      <i class="icon icon-back" />
    </button>
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
        on:click|stopPropagation|preventDefault={() => ''}>
        Menu
        <i class="icon icon-caret" />
      </a>
      <!-- menu component -->
      <ul class="menu">
        <li class="menu-item">
          <a
            href="#/compose"
            class="btn btn-link"
            on:click|stopPropagation|preventDefault={goCompose}>
            Compose
          </a>
        </li>
        <li class="menu-item">
          <a
            href="#/public"
            class="btn btn-link"
            on:click|stopPropagation|preventDefault={goPublic}>
            Public
          </a>
        </li>
        <li class="menu-item">
          <a
            href="#/channels"
            class="btn btn-link"
            on:click|stopPropagation|preventDefault={goChannels}>
            Channels
          </a>
        </li>
        <li class="menu-item">
          <a
            href="#/mentions"
            class="btn btn-link"
            on:click|stopPropagation|preventDefault={goMentions}>
            Mentions
          </a>
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
