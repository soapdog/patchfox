<script>
  const { onMount } = require("svelte");
  const drop = require("drag-and-drop-files");
  const { slide } = require("svelte/transition");
  const { navigate, routeParams, reconnect } = require("../../../utils.js");
  const { getPref } = require("../../../prefs.js");
  const AvatarChip = require("../../../parts/AvatarChip.svelte");
  const Preview = require("./Preview.svelte");

  let showPreview = false;
  let msg = false;
  let error = false;
  let posting = false;

  let channel = $routeParams.channel || "";
  let content = $routeParams.content || "";
  let summary = $routeParams.summary || "";
  let title = $routeParams.title || "";
  let thumbnail = $routeParams.thumbnail;
  let fileOnTop = false;
  let pull = hermiebox.modules.pullStream;
  let fileReader = hermiebox.modules.pullFileReader;
  let sbot = hermiebox.sbot;
  let ipfsDaemonRunning = false;
  let datDaemonRunning = false;

  document.title = `Patchfox - compose new blog post`;

  onMount(() => {
    error = false;
    msg = "";

    // this code could be in some better/smarter place.
    // e.dataTransfer.getData('url'); from images in the browser window

    drop(document.getElementById("content"), files => readFileAndAttach(files));
    checkIpfsDaemon();
    checkDatDaemon();
  });

  const checkIpfsDaemon = () => {
    let port = getPref("ipfsPort", 5001);
    fetch(`http://127.0.0.1:${port}/api/v0/config/show`).then(data => {
      ipfsDaemonRunning = true;
    });
  };

  const checkDatDaemon = () => {
    let port = getPref("datPort", 5001);
    fetch(`http://127.0.0.1:${port}/api/v0/config/show`).then(data => {
      datDaemonRunning = true;
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
        msg = await ssb.newBlogPost({
          content,
          summary,
          channel,
          title,
          thumbnail,
          contentWarning: contentWarning.length > 0 ? contentWarning : undefined
        });
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
              saveToURL();
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
    window.location.search = `?summary=${encodeURIComponent(
      summary
    )}&title=${encodeURIComponent(title)}&content=${encodeURIComponent(
      content
    )}&channel=${encodeURIComponent(channel)}&thumbnail=${encodeURIComponent(
      thumbnail
    )}`;
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

  const attachThumbnailTrigger = () => {
    document.getElementById("thumbnailInput").click();
  };

  const attachFileIPFSTrigger = () => {
    document.getElementById("fileInputIPFS").click();
  };

  const attachFileDATTrigger = () => {
    document.getElementById("fileInputDAT").click();
  };

  const attachFile = ev => {
    const files = ev.target.files;
    readFileAndAttach(files);
  };

  const attachThumbnail = ev => {
    const files = ev.target.files;
    readFileAndAttachThumbnail(files);
  };

  const readFileAndAttachThumbnail = files => {
    error = false;
    msg = "";

    if (files.length == 0) {
      console.log("this is not a file");
      return false;
    }

    var first = files[0];
    console.log(first);

    if (!first.type.startsWith("image")) {
      error = true;
      msg = `You can use images as thumbnail, this file is a ${first.type}`;
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
          msg = "Couldn't add file: " + err + " as thumbnail";
        } else {
          thumbnail = hash;
        }
      })
    );
  };

  const attachFileIPFS = ev => {
    const files = ev.target.files;
    readFileAndAttachIPFS(files);
  };

  const attachFileDAT = ev => {
    const files = ev.target.files;
    readFileAndAttachDAT(files);
  };

  const readFileAndAttachIPFS = async files => {
    error = false;
    msg = "";

    var ipfs = window.IpfsHttpClient("127.0.0.1", "5001");
    const results = await ipfs.add(files[0]);

    console.log("added via IPFS", results);
    content += ` [${results[0].path}](ipfs://${results[0].hash})`;
  };

  let showContentWarningField = false;

  const toggleContentWarning = () =>
    (showContentWarningField = !showContentWarningField);

  let contentWarning = "";
</script>

<style>
  .file-on-top {
    border: solid 2px rgb(26, 192, 11);
  }

  input[type="file"] {
    display: none;
  }

  .thumbnail-preview {
    max-height: 200px;
  }
</style>

<div class="container">
  <div class="columns">
    <div class="column">
      {#if msg}
        {#if error}
          <div class="toast toast-error">{msg}</div>
        {:else}
          <div class="toast toast-success">
            Your blog post has been posted. Do you want to
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

          <label class="form-label" for="title">Title</label>
          <input
            class="form-input"
            type="text"
            id="title"
            placeholder="title"
            bind:value={title} />

          <label class="form-label" for="summary">Summary</label>
          <textarea
            class="form-input"
            id="summary"
            placeholder="Type in your summary"
            rows="5"
            on:dragover|preventDefault|stopPropagation={dragOver}
            on:dragleave|preventDefault|stopPropagation={dragLeave}
            class:file-on-top={fileOnTop}
            bind:value={summary} />

          <label class="form-label" for="content">Content</label>
          <textarea
            class="form-input"
            id="content"
            placeholder="Type in your blog post content"
            rows="20"
            on:dragover|preventDefault|stopPropagation={dragOver}
            on:dragleave|preventDefault|stopPropagation={dragLeave}
            class:file-on-top={fileOnTop}
            bind:value={content} />
          <div class="d-block m-2">
            <button class="btn btn-link" on:click={toggleContentWarning}>
              CW
            </button>
            {#if showContentWarningField}
              <input
                type="text"
                size="50"
                bind:value={contentWarning}
                placeholder="Describe your content warning (leave empty to no
                use it)" />
            {/if}
          </div>
          {#if thumbnail}
            <div class="d-block m-2">
              <p>Thumbnail</p>
              <img
                class="thumbnail-preview"
                src="http://localhost:8989/blobs/get/{thumbnail}"
                alt="post thumbnail" />
            </div>
          {/if}
          <input type="file" on:input={attachThumbnail} id="thumbnailInput" />
          <button class="btn" on:click={attachThumbnailTrigger}>
            Attach Thumbnail Image
          </button>
          <input type="file" on:input={attachFile} id="fileInput" />
          <button class="btn" on:click={attachFileTrigger}>Attach File</button>
          {#if ipfsDaemonRunning}
            <input type="file" on:input={attachFileIPFS} id="fileInputIPFS" />
            <button class="btn" on:click={attachFileIPFSTrigger}>
              Attach File using IPFS
            </button>
          {/if}
          {#if datDaemonRunning}
            <input type="file" on:input={attachFileDAT} id="fileInputDAT" />
            <button class="btn" on:click={attachFileDATTrigger}>
              Attach File using Dat
            </button>
          {/if}
          <button class="btn btn-primary float-right" on:click={preview}>
            Preview
          </button>
        </div>
      {:else}
        <div class="column col-md-12">
          <Preview
            {channel}
            {title}
            {summary}
            {content}
            {contentWarning}
            {thumbnail} />
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
