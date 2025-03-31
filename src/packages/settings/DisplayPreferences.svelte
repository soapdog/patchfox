<script>
  const { getPref, setPref } = patchfox
  let limit = getPref("limit", 10)

  // message type filters
  let showTypeUnknown = getPref("showTypeUnknown", true)
  let showTypeAbout = getPref("showTypeAbout", true)
  let showTypeBlog = getPref("showTypeBlog", true)
  let showTypeChannel = getPref("showTypeChannel", true)
  let showTypeContact = getPref("showTypeContact", true)
  let showTypePost = getPref("showTypePost", true)
  let showTypePrivate = getPref("showTypePrivate", true)
  let showTypePub = getPref("showTypePub", true)
  let showTypeVote = getPref("showTypeVote", true)
</script>

<h1 class="uppercase font-medium text-xl mb-4">Display Preferences</h1>

<div class="form-control w-48">
  <label class="label" for="limit"><span class="label-text">Messages per page</span></label>
  <input class="input input-bordered" type="number" bind:value={limit} on:change={() => setPref("limit", limit)} />
</div>

<div class="prose">
<p>
  Which message types you want to see?
  <a target="_blank" href="/docs/index.html#/message_types/">
    Click here for more information about
    <i>Message Types</i>
  </a>
</p>

<div class="form-control">
<label class="label">
  <span class="label-text"><b>About:</b> people setting avatars and descriptions; also gatherings</span>
  <input class="checkbox" type="checkbox" bind:checked={showTypeAbout} on:change={ev => { setPref("showTypeAbout", showTypeAbout) }} />
</label>
</div>

<div class="form-control">
<label class="label">
  <span class="label-text"><b>Blog:</b> Longform text posts</span>
  <input class="checkbox" type="checkbox" bind:checked={showTypeBlog} on:change={ev => { setPref("showTypeBlog", showTypeBlog) }} />
</label>
</div>

<div class="form-control">
<label class="label">
  <span class="label-text"><b>Channel:</b> People subscribing to channels</span>
  <input class="checkbox" type="checkbox" bind:checked={showTypeChannel} on:change={ev => { setPref("showTypeChannel", showTypeChannel) }} />
</label>
</div>

<div class="form-control">
<label class="label">
  <span class="label-text"><b>Contact:</b> People following each other</span>
  <input class="checkbox" type="checkbox" bind:checked={showTypeContact} on:change={ev => { setPref("showTypeContact", showTypeContact) }} />
</label>
</div>

<div class="form-control">
<label class="label">
  <span class="label-text"><b>Posts:</b> Common content post, leave this on or this app will not be that fun</span>
  <input class="checkbox" type="checkbox" bind:checked={showTypePost} on:change={ev => { setPref("showTypePost", showTypePost) }} />
</label>
</div>

<div class="form-control">
<label class="label">
  <span class="label-text"><b>Pub:</b> Pub servers announcements</span>
  <input class="checkbox" type="checkbox" bind:checked={showTypePub} on:change={ev => { setPref("showTypePub", showTypePub) }} />
</label>
</div>

<div class="form-control">
<label class="label">
  <span class="label-text"><b>Private:</b> Private messages You wont be able to read them, but youll see their encrypted content passing by</span>
  <input class="checkbox" type="checkbox" bind:checked={showTypePrivate} on:change={ev => { setPref("showTypePrivate", showTypePrivate) }} />
</label>
</div>

<div class="form-control">
<label class="label">
  <span class="label-text"><b>Vote:</b> People liking/digging stuff</span>
  <input class="checkbox" type="checkbox" bind:checked={showTypeVote} on:change={ev => { setPref("showTypeVote", showTypeVote) }} />
</label>
</div>

<div class="divider" />

<div class="form-control">
<label class="label">
  <span class="label-text"><b>Extra</b> Show extra messages such as book club and others</span>
  <input class="checkbox" type="checkbox" bind:checked={showTypeUnknown} on:change={ev => { setPref("showTypeUnknown", showTypeUnknown) }} />
</label>
</div>
</div>
