<script>
  const { onMount } = require("svelte");
  const drop = require("drag-and-drop-files");
  const { slide } = require("svelte/transition");
  const AvatarChip = require("../../core/components/AvatarChip.svelte");
  const MessageRenderer = require("../../core/components/MessageRenderer.svelte");
  const { getPref } = require("../../core/kernel/prefs.js");
  const pull = require("pull-stream");
  const fileReader = require("pull-file-reader");
  const Tribute = require("tributejs");

  export let root = false;
  export let branch = false;
  export let channel = "";
  export let content = "";
  export let replyfeed = false;
  export let fork = false;

  let fileOnTop = false;
  let sbot = ssb.sbot;
  let showContentWarningField = false;
  let contentWarning = "";
  let showPreview = false;
  let msg = false;
  let error = false;
  let posting = false;
  let branchedMsg = false;

  document.title = `Patchfox - compose`;

  if (branch) {
    ssb.get(branch).then(data => (branchedMsg = { key: branch, value: data }));
  }

  onMount(() => {
    error = false;
    msg = "";

    // this code could be in some better/smarter place.
    // e.dataTransfer.getData('url'); from images in the browser window

    drop(document.getElementById("content"), files => readFileAndAttach(files));

    let usersObjs = ssb.getAllCachedUsers();
    let users = [];
    for (let id in usersObjs) {
      users.push({
        key: usersObjs[id].name,
        value: `[@${usersObjs[id].name}](${usersObjs[id].id})`
      });
    }
    const tribute = new Tribute({
      values: users,
      selectTemplate: function(item) {
        return  item.original.value;
      }
    });

    tribute.attach(document.getElementById("content"));
  });

  const readFileAndAttach = files => {
    try {
      error = false;
      msg = "";

      if (files.length == 0) {
        fileOnTop = false;
        return false;
      }

      var first = files[0];
      console.log(first);

      if (!first.type.startsWith("image")) {
        error = true;
        msg = `You can only drag & drop image, this file is a ${first.type}`;
        return false;
      }

      if (first.size >= 5000000) {
        error = true;
        msg = `File too large: ${Math.floor(
          first.size / 1048576,
          2
        )}mb when max size is 5mb`;
        return false;
      }

      pull(
        fileReader(first),
        sbot.blobs.add(function(err, hash) {
          // 'hash' is the hash-id of the blob
          if (err) {
            error = true;
            msg = "Couldn't attach file: " + err;
          } else {
            content += ` ![${first.name}](${hash})`;
          }
          fileOnTop = false;
        })
      );
    } catch (n) {
      console.error("error, attaching", n);
    }
  };

  const post = async ev => {
    ev.stopPropagation();
    ev.preventDefault();

    if (!posting) {
      saveToURL();
      posting = true;

      if (channel && channel.length > 0 && channel.startsWith("#")) {
        channel = channel.slice(1);
      }

      if (channel && channel.length == 0) {
        channel = undefined;
      }

      try {
        msg = await ssb.newPost({
          text: content,
          channel,
          root,
          branch,
          fork,
          contentWarning: contentWarning.length > 0 ? contentWarning : undefined
        });
        posting = false;
        console.log("posted", msg);
        window.scrollTo(0, 0);
      } catch (n) {
        error = true;
        msg = `Couldn't post your message: ${n}`;
        window.scrollTo(0, 0);

        if (msg.message === "stream is closed") {
          msg += ". We lost connection to sbot. We'll try to restablish it...";
        }
      }
    }
  };

  const preview = ev => {
    showPreview = true;
  };

  const saveToURL = ev => {
    let data = {};
    if (content) data.content = content;
    if (channel) data.channel = channel;
    if (root) data.root = root;
    if (branch) data.branch = branch;
    if (fork) data.fork = fork;
    if (contentWarning.length > 0) data.contentWarning = contentWarning;

    patchfox.emit("package:save:state", { pkg: "post", view: "compose", data });
  };

  const avatarClick = ev => {
    let feed = ev.detail.feed;
    let name = ev.detail.name;

    if (content.length > 0) {
      content += ` [${name}](${feed})`;
    } else {
      content = `[${name}](${feed})`;
    }
  };

  const dragOver = ev => {
    fileOnTop = true;
  };

  const dragLeave = ev => {
    fileOnTop = false;
  };

  const attachFileTrigger = () => {
    document.getElementById("fileInput").click();
  };

  const attachFile = ev => {
    const files = ev.target.files;
    readFileAndAttach(files);
  };

  const toggleContentWarning = () =>
    (showContentWarningField = !showContentWarningField);
</script>

<style>
  .file-on-top {
    border: solid 2px rgb(26, 192, 11);
  }

  input[type="file"] {
    display: none;
  }
</style>

<div class="container">
  <div class="columns">
    <div class="column">
      {#if fork}
        <div class="toast toast-warning">You are forking: {fork}</div>
      {/if}
      {#if msg}
        {#if error}
          <div class="toast toast-error">{msg}</div>
        {:else}
          <div class="toast toast-success">
            Your message has been posted. Do you want to
            <a
              target="_blank"
              href="?pkg=hub&view=thread&thread={encodeURIComponent(msg.key)}">
              Check it out?
            </a>
          </div>
        {/if}
      {/if}
      {#if !showPreview}
        <div class="form-group" in:slide out:slide>
          <label class="form-label" for="channel">Channel</label>
          <input
            class="form-input"
            type="text"
            id="channel"
            placeholder="channel"
            bind:value={channel} />

          {#if branch}
            <label class="form-label" for="reply-to">In reply to</label>
            <input
              class="form-input"
              type="text"
              id="reply-to"
              placeholder="in reply to"
              bind:value={branch} />
            {#if branchedMsg}
              <MessageRenderer msg={branchedMsg} />
            {:else}
              <p class="loading">Loading...</p>
            {/if}
          {/if}

          {#if replyfeed}
            <div class="mt-2">
              <span>
                Click the avatar to add a link to the message:
                <AvatarChip feed={replyfeed} on:avatarClick={avatarClick} />
              </span>
            </div>
          {/if}
          <label class="form-label" for="content">Message</label>
          <textarea
            class="form-input"
            id="content"
            placeholder="Type in your post"
            rows="10"
            on:dragover|preventDefault|stopPropagation={dragOver}
            on:dragleave|preventDefault|stopPropagation={dragLeave}
            class:file-on-top={fileOnTop}
            bind:value={content} />
          <div class="d-block m-1">
            <button class="btn btn-link" on:click={toggleContentWarning}>
              Add Content Warning
            </button>
            {#if showContentWarningField}
              <input
                type="text"
                size="50"
                bind:value={contentWarning}
                placeholder="Describe your content warning (leave empty to not
                use it)" />
            {/if}
          </div>
          <input type="file" on:input={attachFile} id="fileInput" />
          <button class="btn" on:click={attachFileTrigger}>Attach File</button>
          <button class="btn btn-primary float-right" on:click={preview}>
            Preview
          </button>
        </div>
      {:else}
        <div class="column col-md-12">
          <h2>Post preview</h2>
          {#if channel || root || branch || contentWarning.length > 0}
            <blockquote>
              {#if channel}
                <p>
                  <b>Channel:</b>
                  {channel.startsWith('#') ? channel.slice(1) : channel}
                </p>
              {/if}
              {#if root}
                <p>
                  <b>Root:</b>
                  {root}
                </p>
              {/if}
              {#if branch}
                <p>
                  <b>In Reply To:</b>
                  {branch}
                </p>
              {/if}
              {#if contentWarning.length > 0}
                <p>
                  <b>Content Warning:</b>
                  {contentWarning}
                </p>
              {/if}
            </blockquote>
          {/if}
          {@html ssb.markdown(content)}

          <div class="divider" />
          <div class="columns">
            <div class="column col-md-12 col-lg-10">
              <span class="label label-warning">
                This message will be public and can't be edited or deleted
              </span>
            </div>
            <div class="column col-md-12 col-lg-2">
              <button class="btn" on:click={() => (showPreview = false)}>
                Go Back
              </button>
              <button
                class="btn btn-primary"
                class:loading={posting}
                disabled={!error && typeof msg.key == 'string'}
                on:click={post}>
                Post
              </button>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
