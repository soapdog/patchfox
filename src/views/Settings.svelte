<script>
  import { onMount } from "svelte";
  import { getPref, setPref } from "../utils.js";

  let keys = {};
  let remote = "";
  let limit = getPref("limit", 10);

  document.title = "Patchfox - Settings";

  // message type filters
  let showTypeUnknown = getPref("showTypeUnknown", true);
  let showTypeAbout = getPref("showTypeAbout", true);
  let showTypeBlog = getPref("showTypeBlog", true);
  let showTypeChannel = getPref("showTypeChannel", true);
  let showTypeContact = getPref("showTypeContact", true);
  let showTypePost = getPref("showTypePost", true);
  let showTypePrivate = getPref("showTypePrivate", true);
  let showTypePub = getPref("showTypePub", true);
  let showTypeVote = getPref("showTypeVote", true);

  const saveConfigurationRequest = ev => {
    keys = JSON.parse(secretInput.value);
    remote = remoteInput.value;
    storeSettings(keys, remote, manifest);
    browser.tabs.create({
      url: browser.extension.getURL("/index.html#/public")
    });
  };

  /*
Store the currently selected settings using browser.storage.local.
*/
  const storeSettings = (keys, remote, manifest) => {
    browser.storage.local.set({
      keys,
      remote,
      manifest
    });
  };

  const selectedFile = ev => {
    const secretFile = ev.target.files[0];
    const reader = new FileReader();
    reader.onload = function(evt) {
      console.log(evt.target.result);
      const contents = evt.target.result;
      let secret = contents.split("\n").filter(function(line) {
        return line.indexOf("#") != 0;
      });
      secret = JSON.parse(secret.join("\n"));
      remote = `ws://localhost:8989~shs:${secret.id.slice(
        0,
        secret.id.indexOf("=") + 1
      )}`;
      updateUI({ keys: secret, remote });
    };
    reader.readAsText(secretFile);
  };

  const updateUI = savedData => {
    console.log("saved data from settings", savedData);
    remote = savedData.remote;
    keys = JSON.stringify(savedData.keys, null, 2);
  };

  const onError = error => {
    console.error("error on settings", error);
  };

  const gettingStoredSettings = browser.storage.local
    .get()
    .then(updateUI, onError);
</script>

<h1>Settings</h1>

<h4>Connection & Identity</h4>

<form class="form-group">
  <label class="form-label" for="secret-file">
    Patchfox can infer the values for both
    <i>remote</i>
    and
    <i>secret</i>
    from your
    <code>~/.ssb/secret</code>
    file. You can use the button below to browse for it.
  </label>
  <input
    type="file"
    class="form-input"
    id="secret-file"
    on:change={selectedFile} />
  <label class="form-label" for="remote">Remote</label>
  <input
    class="form-input"
    type="text"
    id="remote"
    placeholder="remote"
    bind:value={remote} />

  <label class="form-label" for="secret">Secret</label>
  <textarea
    class="form-input"
    id="secret"
    placeholder="remote"
    rows="8"
    bind:value={keys} />
  <br />
  <button class="btn btn-primary float-right">Save Identity & Remote</button>
  <p>Saving identity and remote will cause a full page refresh.</p>
</form>

<h4>Vieweing Experience</h4>
<form class="form-group">
  <label class="form-label" for="limit">Messages per page</label>
  <input class="form-input" type="number" bind:value={limit} />

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
      bind:checked={showTypePrivate}
      on:change={ev => {
        setPref('showTypePrivate', showTypePrivate);
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
</form>
