<script>
  import { onMount } from "svelte";
  import drop from "drag-and-drop-files";
  import { slide } from "svelte/transition";
  import { navigate, routeParams, reconnect, getPref } from "../utils.js";
  import AvatarChip from "../parts/AvatarChip.svelte";

  let showPreview = false;
  let msg = false;
  let error = false;
  let posting = false;

  let root = $routeParams.root;
  let branch = $routeParams.branch;
  let channel = $routeParams.channel || "";
  let content = $routeParams.content || "";
  let replyfeed = $routeParams.replyfeed || false;
  let fork = $routeParams.fork;
  let fileOnTop = false;
  let pull = hermiebox.modules.pullStream;
  let fileReader = hermiebox.modules.pullFileReader;
  let sbot = hermiebox.sbot;
  let ipfsDaemonRunning = false;

  document.title = `Patchfox - compose`;

  onMount(() => {
    error = false;
    msg = "";

    // this code could be in some better/smarter place.
    // e.dataTransfer.getData('url'); from images in the browser window

    drop(document.getElementById("content"), files => readFileAndAttach(files));
    checkIpfsDaemon();
  });

  const checkIpfsDaemon = () => {
    let port = getPref("ipfsPort", 5001);
    fetch(`http://127.0.0.1:${port}/api/v0/config/show`).then(data => {
      ipfsDaemonRunning = true;
    });
  };

  const readFileAndAttach = files => {
    error = false;
    msg = "";

    if (files.length == 0) {
      fileOnTop = false;
      console.log("this is not a file");
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
  };

  const post = async ev => {
    ev.stopPropagation();
    ev.preventDefault();

    if (!posting) {
      posting = true;

      if (channel.startsWith("#")) {
        channel = channel.slice(1);
      }

      try {
        msg = await ssb.newPost({ text: content, channel, root, branch, fork });
        posting = false;
        console.log("posted", msg);
        window.scrollTo(0, 0);
      } catch (n) {
        error = true;
        msg = `Couldn't post your message: ${n}`;
        window.scrollTo(0, 0);

        if (msg.message == "stream is closed") {
          msg += ". We lost connection to sbot. We'll try to restablish it...";

          reconnect()
            .then(() => {
              showPreview = false;
              posting = false;
              error = false;
              msg = "Connection to sbot reestablished. Try posting again";
            })
            .catch(err => {
              window.location.search = `?root=${encodeURIComponent(
                root
              )}&branch=${encodeURIComponent(
                branch
              )}&content=${encodeURIComponent(
                content
              )}&channel=${encodeURIComponent(channel)}`;
              msg = `Sorry, couldn't reconnect to sbot:${err}. Try reloading the page. Your content has been saved to the URL`;
            });
        }
      }
    }
  };

  const preview = ev => {
    showPreview = true;
  };

  const saveToURL = ev => {
    window.location.search = `?root=${encodeURIComponent(
      root
    )}&branch=${encodeURIComponent(branch)}&content=${encodeURIComponent(
      content
    )}&channel=${encodeURIComponent(channel)}`;
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

  const attachFileIPFSTrigger = () => {
    document.getElementById("fileInputIPFS").click();
  };

  const attachFile = ev => {
    const files = ev.target.files;
    readFileAndAttach(files);
  };

  const attachFileIPFS = ev => {
    const files = ev.target.files;
    readFileAndAttachIPFS(files);
  };

  const readFileAndAttachIPFS = async files => {
    error = false;
    msg = "";

    var ipfs = window.IpfsHttpClient('127.0.0.1', '5001')
    const results = await ipfs.add(files[0])

    console.log("added via IPFS", results)
    content += ` [${results[0].path}](ipfs://${results[0].hash})`;

   
  };
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
              href="?thread={encodeURIComponent(msg.key)}#/thread">
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
          <br />
          <input type="file" on:input={attachFile} id="fileInput" />
          <button class="btn" on:click={attachFileTrigger}>Attach File</button>
          {#if ipfsDaemonRunning}
            <input type="file" on:input={attachFileIPFS} id="fileInputIPFS" />
            <button class="btn" on:click={attachFileIPFSTrigger}>
              Attach File using IPFS
            </button>
          {/if}
          <button class="btn btn-primary float-right" on:click={preview}>
            Preview
          </button>
        </div>
      {:else}
        <div class="column col-md-12">
          <h2>Post preview</h2>
          {#if channel || root || branch}
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
