<script>
  const queryString = require("query-string")
  const IdentitySwitcher = require("../../core/components/IdentitySwitcher.svelte")
  const ThemeSwitcher = require("../../core/components/ThemeSwitcher.svelte")

  let groups = patchfox.menuGroups()
  let groupKeys = Object.keys(groups)
  let currentPackage = false
  let browserSidebarSupport = typeof browser.sidebarAction === "object"
  let currentQuery = queryString.parse(location.search)
  let title = ""

  patchfox._title.subscribe(newTitle => {
    title = newTitle
  })

  patchfox.listen("package:changed", (event, pkg) => {
    currentPackage = pkg || false
  })

  const menuItemToURL = ({ pkg, view, data }) => {
    let state = { pkg, view, ...data }
    if (currentQuery.identity) {
      state.identity = currentQuery.identity
    }
    let qs = queryString.stringify(state)
    return qs
  }

  let query = ""
  const search = ev => {
    patchfox.go("search", "query", { query })
  }

  const openSidebar = async ev => {
    let loc = window.location.href
    browser.sidebarAction.setPanel({ panel: loc })
    browser.sidebarAction.open()
  }

  const closeSidebar = async ev => {
    let loc = await browser.sidebarAction.getPanel({})
    await browser.tabs.create({ url: loc })
    await browser.sidebarAction.close()
  }
</script>

<div class="navbar  mb-2 bg-accent rounded-box text-accent-content">
      {#if browserSidebarSupport}
      <div class="flex-none">
        <button class="btn btn-square btn-ghost" on:click={openSidebar}>
            <i class="fas fa-arrow-left fa-lg" />
        </button>
      </div>
      {/if}
    <div class="flex-1 px-2 mx-2">
      <div class="items-stretch hidden lg:flex">
      {#each groupKeys as key}
        <div class="dropdown dropdown-hover">
          <div class="btn btn-ghost rounded-btn" tabindex="0">
            {key}
          </div>
          <ul class="shadow menu dropdown-content text-base-content bg-base-100 rounded-box w-52 font-extralight">
            {#each groups[key] as menu, i}
              {#if menu.label}
                <div class="divider"><span>{menu.label}</span></div>
              {/if}
              {#each menu.items as item}
                <li class="">
                  {#if item.event === "package:go"}
                    <a
                      href="?{menuItemToURL(item.data)}"
                      tabindex="0"
                      on:keydown|stopPropagation|preventDefault={() => {
                        patchfox.triggerMenu(item)
                      }}
                      on:click|stopPropagation|preventDefault={() => {
                        patchfox.triggerMenu(item)
                      }}>
                      {item.label}
                    </a>
                  {:else}
                    <a
                      href="?{menuItemToURL(item.data)}"
                      tabindex="0"
                      on:keydown|stopPropagation|preventDefault={() => {
                        patchfox.triggerMenu(item)
                      }}
                      on:click|stopPropagation|preventDefault={() => {
                        patchfox.triggerMenu(item)
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
    </div>
    </div>
    <div class="flex-1 lg:flex-none mr-2">
        <div class="form-control">
          <div class="relative">
          <input
            class="w-full pr-16 input input-accent input-ghost input-bordered border-accent-focus"
            type="text"
            bind:value={query}
            placeholder="search" />
          <button 
            class="absolute top-0 right-0 rounded-l-none btn btn-accent border-accent-focus" 
            on:click={search} 
            tabindex="0">
              <i class="fas fa-search" />
          </button>
          </div>
        </div>
      </div>
      <div class="flex-none">
    </div>
    <div class="flex-none">
      {#if window.hasOwnProperty("ssb") && ssb?.feed}
      <IdentitySwitcher feed={ssb.feed} />
      {/if}
    </div>
    <div class="flex-none">
      <ThemeSwitcher />
    </div>
</div>

{#if currentPackage}
<div class="text-xl breadcrumbs capitalize">
  <ul>
    <li>
      {currentPackage.packageToOpen.name}
    </li>
    {#if currentPackage.view && currentPackage.view.toLowerCase() !== "view"}
    <li>
      {currentPackage.view}
    </li>
    {/if}
    {#if title.length > 0 && (title.toLowerCase() !== currentPackage.view.toLowerCase())}
    <li class="normal-case">
      {title}
    </li>
    {/if}
  </ul>
</div>
{/if}
