<script>
  const Spinner = require("../../core/components/Spinner.svelte")
  const Posts = require("./Posts.svelte")
  const Following = require("./Following.svelte")
  const Followers = require("./Followers.svelte")
  const Friends = require("./Friends.svelte")
  const Editor = require("./ProfileEditor.svelte")
  const MoreInfo = require("./MoreInfo.svelte")
  const ssbUri  = require("ssb-uri2")
  const pull = require("pull-stream")

  export let feed = ssb.feed

  let profile = false
  let description = false
  let following = false
  let blocking = false
  let image
  let lastAbout
  let avatarPromise 
  let aboutPromise
  let aliasesPromise

  let subViews = {
    posts: Posts,
    following: Following,
    followers: Followers,
    friends: Friends,
    moreInfo: MoreInfo
  }
  
  export let currentSubView = "friends"

  let name = feed
  let followersCount = false
  let followingCount = false
  let friendsCount = false
  let showEditor = false

  patchfox.title(feed)

  avatarPromise = ssb.avatar(feed).then(data => {
    name = data.name
    image = data.image
    patchfox.title(name)
  })

  aboutPromise = ssb.profile(feed).then(data => {
    lastAbout = data.about.reverse().find(m => {
      let a = m.value.content
      return a.hasOwnProperty("description")
    })
    try {
      description = lastAbout.value.content.description
    } catch (n) {
      description = ""
    }
    window.scrollTo(0, 0)
  })

  if (feed !== ssb.feed) {
    ssb.following(feed).then(f => (following = f))
    ssb.blocking(feed).then(f => (blocking = f))
  }

  const blockingChanged = ev => {
    let v = ev.target.checked
    if (v) {
      ssb.block(feed).catch(() => (blocking = false))
    } else {
      ssb.unblock(feed).catch(() => (blocking = true))
    }
  }

  const followingChanged = ev => {
    let v = ev.target.checked
    if (v) {
      ssb.follow(feed).catch(() => (following = false))
    } else {
      ssb.unfollow(feed).catch(() => (following = true))
    }
  }

  const countCallback = ev => {
    let { followers, following, friends } = ev.detail

    if (followers) {
      followersCount = followers
    }

    if (following) {
      followingCount = following
    }

    if (friends) {
      friendsCount = friends
    }
  }

  const toggleEditor = () => {
    showEditor = !showEditor
  }

  let aliases = []
  
  aliasesPromise = ssb.rooms2.getAliases(feed)
    .then(data => {
      aliases = data
    })
    .catch(err => console.error(err))

</script>

<style>
  .extra-actions {
    padding-top: 10px;
    margin-top: 10px;
    border-top: solid 1px lightgray;
  }
</style>

<div class="container">
  {#await aboutPromise && avatarPromise}
  <div class="loading loading-lg" />
  {:then}
  {#if showEditor}
  <Editor
  {feed}
  {name}
  {description}
  {image}
  on:cancelEdit={() => (showEditor = false)} />
  {:else}
  <div class="flex">

    <div class="flex-1">
      <div class="container p-4">
        <img
        class="rounded-xl object-contain md:object-scale-down"
        src={patchfox.httpUrl("/blobs/get/" + image)}
        alt={feed} />
      </div>
    </div>
    <div class="flex-1">
      {#if feed === ssb.feed}
      <div class="bg-accent text-accent-content p-2 mb-4 rounded">
        <span class="">❤ Thats You ❤</span>
        <span class="cursor-pointer float-right" on:click={toggleEditor}>
          <i class="fas fa-edit" />
          Edit your profile
        </span>
      </div>
      {/if}
      <h1 class="uppercase font-medium text-md mt-4">{name}</h1>
      <a href="{ssbUri.fromFeedSigil(feed)}">
        <span class="text-sm font-extralight">{feed}</span>
      </a>
      {#if feed !== ssb.feed}
      <div class="container mt-2">
        <div class="divider" />
        <div class="form-control">
          <label class="cursor-pointer label">
            <span class="label-text">
              following
            </span>
            <input
            type="checkbox"
            class="toggle"
            on:change={followingChanged}
            bind:checked={following} />
          </label>
        </div>
        <div class="form-control">
          <label class="cursor-pointer label">
            <span class="label-text">
            blocking
           </span>
            <input
            type="checkbox"
            class="toggle"
            on:change={blockingChanged}
            bind:checked={blocking} />
          </label>
        </div>
        <div class="divider" />
      </div>
      {/if}
      {#await aboutPromise}
      <Spinner />
      {:then}
      <div class="prose mt-4 mb-4">
        {@html ssb.markdown(description)}
      </div>
      {/await}
      <div class="extra-actions">
        <a href="{patchfox.url("post", "compose", { replyfeed: feed })}" class="btn btn-sm">New post mentioning {name}</a>
      </div>
      <div class="extra-actions">
        <h4>Aliases</h4>
        {#await aliasesPromise}
        <Spinner />
        {:then}
        {#if aliases.length > 0}
        <ul>
        {#each aliases as alias}
          <li><a class="btn btn-link" href="{alias.url}" target="_blank">{alias.url}</a></li>
        {/each}
        </ul>
        {:else}
        <p>No aliases set for this profile</p>
        {/if}
        {/await}
      </div>
    </div>
  </div>
  {/if}
  <br />
  <ul class="tabs tabs-boxed mb-4">
    <li class="tab" class:tab-active={currentSubView === "posts"}>
      <a href="#" on:click|preventDefault={() => (currentSubView = "posts")}>
        Posts
      </a>
    </li>
    <li class="tab" class:tab-active={currentSubView === "friends"}>
      <a
      href="#"
      on:click|preventDefault={() => (currentSubView = "friends")}>
      Friends
      {#if friendsCount}({friendsCount}){/if}
    </a>
  </li>
  <li class="tab" class:tab-active={currentSubView === "following"}>
    <a
    href="#"
    on:click|preventDefault={() => (currentSubView = "following")}>
    Following
    {#if followingCount}({followingCount}){/if}
  </a>
</li>
<li class="tab" class:tab-active={currentSubView === "followers"}>
  <a
  href="#"
  on:click|preventDefault={() => (currentSubView = "followers")}>
  Followers
  {#if followersCount}({followersCount}){/if}
</a>
</li>
<li class="tab" class:tab-active={currentSubView === "moreInfo"}>
  <a href="#" on:click|preventDefault={() => (currentSubView = "moreInfo")}>
    More Info
  </a>
</li>
</ul>
<br />
<svelte:component
this={subViews[currentSubView]}
{feed}
on:count={countCallback} />
{:catch n}
<p>Error: {n.message}</p>
{/await}
</div>
