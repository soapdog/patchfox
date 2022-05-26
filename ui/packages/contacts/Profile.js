const m = require("mithril")
  const Spinner = require("../../core/components/Spinner.js")
  const Posts = require("./Posts.js")
  const Following = require("./Following.js")
  const Followers = require("./Followers.js")
  const Friends = require("./Friends.js")
  const Editor = require("./ProfileEditor.js")
  const MoreInfo = require("./MoreInfo.js")
  const ssbUri  = require("ssb-uri2")
  const pull = require("pull-stream")
  
  const ProfileView = {
    oninit: vnode => {
      let feed = vnode.attrs.feed || ssb.feed
      vnode.state.name = feed
      vnode.state.blocking = false 
      vnode.state.following = false
      vnode.state.showEditor = false
      vnode.state.loadingAvatar = true
      vnode.state.loadingAbout = true
      
      ssb.avatar(feed).then(data => {
        vnode.state.name = data.name
        vnode.state.image = data.image
        vnode.state.loadingAvatar = false
        patchfox.title(name)
      })
    
      ssb.profile(feed).then(data => {
        vnode.state.lastAbout = data.about.reverse().find(m => {
          let a = m.value.content
          return a.hasOwnProperty("description")
        })
        try {
          vnode.state.description = vnode.state.lastAbout.value.content.description
        } catch (n) {
          vnode.state.description = ""
        }
        window.scrollTo(0, 0)
        vnode.state.loadingAbout = false
      })
      
      if (feed !== ssb.feed) {
        ssb.following(feed).then(f => {
          vnode.state.following = f
          m.redraw()
        })
        ssb.blocking(feed).then(f => {
          vnode.state.blocking = f
          m.redraw()
        })
      }
      
      vnode.state.aliases = []
      
      ssb.rooms2.getAliases(feed)
        .then(data => {
          vnode.state.aliases = data
          m.redraw()
        })
        .catch(err => console.error(err))
    },
    view: vnode => {

      let feed = vnode.attrs.feed || ssb.feed
      let currentSubView = vnode.attrs.currentSubView || "friends"
    
      let profile = vnode.state.profile
      let description = vnode.state.description
      let following = vnode.state.following 
      let blocking = vnode.state.blocking 
      let image = vnode.state.image
      let lastAbout = vnode.state.lastAbout
      let name = vnode.state.name
      let followersCount = false
      let followingCount = false
      let friendsCount = false
      let showEditor = vnode.state.showEditor
    
      let subViews = {
        posts: Posts,
        following: Following,
        followers: Followers,
        friends: Friends,
        moreInfo: MoreInfo
      }
    
      patchfox.title(feed)
    
      const blockingChanged = ev => {
        let v = ev.target.checked
        if (v) {
          ssb.block(feed).catch(() => {
            vnode.state.blocking = false
            m.redraw()
          })
        } else {
          ssb.unblock(feed).catch(() => {
            vnode.state.blocking = true
            m.redraw()
          })
        }
      }
    
      const followingChanged = ev => {
        let v = ev.target.checked
        if (v) {
          ssb.follow(feed).catch(() => {
            vnode.state.following = false
            m.redraw()
          })
        } else {
          ssb.unfollow(feed).catch(() => {
            following = true
            m.redraw()
          })
        }
      }
    
      const countCallback = ev => {
        let { followers, following, friends } = ev.detail
    
        if (followers) {
          vnode.state.followersCount = followers
        }
    
        if (following) {
          vnode.state.followingCount = following
        }
    
        if (friends) {
          vnode.state.friendsCount = friends
        }
        
        m.redraw()
      }
    
      const toggleEditor = () => {
        vnode.state.showEditor = !vnode.state.showEditor
      }
      
      
      if (vnode.state.loadingAvatar || vnode.state.loadingAbout) {
        return m(".container", [
          m(Spinner)
        ])
      }
      
      if (vnode.state.showEditor) {
        return m(".container", m(Editor, {
          feed,
          name,
          description,
          image,
          onCancelEdit=() => vnode.state.showEditor = false
        }))
      }
      
      // TODO: this is completely broken.
      
      return m(".container", [
        m(".flex", 
          m(".flex-1",
            m(".container.p-4", 
              m("img"))))
      ])


<div class="container">
 
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
}
}

module.exports = ProfileView
