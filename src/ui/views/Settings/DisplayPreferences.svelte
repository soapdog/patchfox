<script>
  const { getPref, setPref } = require("../../prefs.js");
  let limit = getPref("limit", 10);
  let columnSize = getPref("columnSize", "short");

  document.title = "Patchfox - Settings - Display Preferences";

  // message type filters
  let showTypeUnknown = getPref("showTypeUnknown", false);
  let showTypeAbout = getPref("showTypeAbout", true);
  let showTypeBlog = getPref("showTypeBlog", true);
  let showTypeChannel = getPref("showTypeChannel", true);
  let showTypeContact = getPref("showTypeContact", true);
  let showTypePost = getPref("showTypePost", true);
  let showTypePrivate = getPref("showTypePrivate", true);
  let showTypePub = getPref("showTypePub", true);
  let showTypeVote = getPref("showTypeVote", true);
</script>

<h1 class="title">Display Preferences</h1>
<form class="form-group">
 <label class="form-label">
    Feed column size. There is research that says that a short column size makes
    for a more pleasant reading experience, still some users prefer to use the
    full screen space. Your choice is between reading through long text lines or
    short ones.
  </label>
  <label class="form-radio">
    <input
      type="radio"
      name="column-size"
      bind:group={columnSize}
      on:change={() => setPref('columnSize', columnSize)}
      value="short" />
    <i class="form-icon" />
    Short column
  </label>
  <label class="form-radio">
    <input
      type="radio"
      name="column-size"
      bind:group={columnSize}
      on:change={() => setPref('columnSize', columnSize)}
      value="long" />
    <i class="form-icon" />
    Long column
  </label>
  <label class="form-label" for="limit">Messages per page</label>
  <input
    class="form-input"
    type="number"
    bind:value={limit}
    on:change={() => setPref('limit', limit)} />

  <br />
  <span>
    Which message types you want to see?
    <a target="_blank" href="/docs/index.html#/message_types/">
      Click here for more information about
      <i>Message Types</i>
    </a>
  </span>
  <label class="form-switch">
    <input
      type="checkbox"
      bind:checked={showTypeAbout}
      on:change={ev => {
        setPref('showTypeAbout', showTypeAbout);
      }} />
    <i class="form-icon" />
    <b>About</b>
    (aka people setting avatars and descriptions; gatherings)
  </label>
  <label class="form-switch">
    <input
      type="checkbox"
      bind:checked={showTypeBlog}
      on:change={ev => {
        setPref('showTypeBlog', showTypeBlog);
      }} />
    <i class="form-icon" />
    <b>Blog</b>
    (Longform text posts)
  </label>
  <label class="form-switch">
    <input
      type="checkbox"
      bind:checked={showTypeChannel}
      on:change={ev => {
        setPref('showTypeChannel', showTypeChannel);
      }} />
    <i class="form-icon" />
    <b>Channel</b>
    (People subscribing to channels)
  </label>
  <label class="form-switch">
    <input
      type="checkbox"
      bind:checked={showTypeContact}
      on:change={ev => {
        setPref('showTypeContact', showTypeContact);
      }} />
    <i class="form-icon" />
    <b>Contact</b>
    (People following each other)
  </label>
  <label class="form-switch">
    <input
      type="checkbox"
      bind:checked={showTypePost}
      on:change={ev => {
        setPref('showTypePost', showTypePost);
      }} />
    <i class="form-icon" />
    <b>Posts</b>
    (Common content post, leave this on or it is not that fun)
  </label>
  <label class="form-switch">
    <input
      type="checkbox"
      bind:checked={showTypePub}
      on:change={ev => {
        setPref('showTypePub', showTypePub);
      }} />
    <i class="form-icon" />
    <b>Pub</b>
    (Pub servers announcements)
  </label>

  <label class="form-switch">
    <input
      type="checkbox"
      bind:checked={showTypePrivate}
      on:change={ev => {
        setPref('showTypePrivate', showTypePrivate);
      }} />
    <i class="form-icon" />
    <b>Private</b>
    (Private messages; You won't be able to read them, but you'll see their
    encrypted content passing by)
  </label>

  <label class="form-switch">
    <input
      type="checkbox"
      bind:checked={showTypeVote}
      on:change={ev => {
        setPref('showTypeVote', showTypeVote);
      }} />
    <i class="form-icon" />
    <b>Vote</b>
    (People liking/digging stuff)
  </label>
  <div class="divider" />
  <label class="form-switch">
    <input
      type="checkbox"
      bind:checked={showTypeUnknown}
      on:change={ev => {
        setPref('showTypeUnknown', showTypeUnknown);
      }} />
    <i class="form-icon" />
    <b>Unknown</b>
    (Show messages Patchfox doesn't understand as their raw content)
  </label>
  <br />
</form>
