<script>
  const { onMount } = require("svelte")
  const drop = require("drag-and-drop-files")
  const { slide } = require("svelte/transition")
  const { getPref } = require("../../core/kernel/prefs.js")
  const AvatarChip = require("../../core/components/AvatarChip.svelte")
  const Preview = require("./BlogComposePreview.svelte")
  const pull = require("pull-stream")
  const fileReader = require("pull-file-reader")
  const Tribute = require("tributejs")

  let showPreview = false
  let msg = false
  let error = false
  let posting = false

  export let channel = ""
  export let content = ""
  export let summary = ""
  export let title = ""
  export let thumbnail = false

  let fileOnTop = false
  let sbot = ssb.sbot
  let ipfsDaemonRunning = false
  let datDaemonRunning = false
  let textSize = getPref("composeSize", "text")



  patchfox.title("compose new blog post")

  onMount(() => {
    error = false
    msg = ""

    // this code could be in some better/smarter place.
    // e.dataTransfer.getData('url') from images in the browser window

    drop(document.getElementById("content"), files => readFileAndAttach(files))
    checkIpfsDaemon()
    checkDatDaemon()

    let usersObjs = ssb.getAllCachedUsers()
    let users = []
    for (let id in usersObjs) {
      users.push({
        key: usersObjs[id].name,
        value: `[@${usersObjs[id].name}](${usersObjs[id].id})`
      })
    }
    const tribute = new Tribute({
      values: users,
      selectTemplate: function(item) {
        return item.original.value
      }
    })

    tribute.attach(document.getElementById("content"))
    tribute.attach(document.getElementById("summary"))
  })

  const checkIpfsDaemon = () => {
    let port = getPref("ipfsPort", 5001)
    fetch(`http://127.0.0.1:${port}/api/v0/config/show`).then(data => {
      ipfsDaemonRunning = true
    })
  }

  const checkDatDaemon = () => {
    datDaemonRunning = false
  }

  const readFileAndAttach = files => {
    error = false
    msg = ""

    if (files.length == 0) {
      fileOnTop = false
      console.log("this is not a file")
      return false
    }

    var first = files[0]

    if (!first.type.startsWith("image")) {
      error = true
      msg = `You can only drag & drop image, this file is a ${first.type}`
      return false
    }

    if (first.size >= 5000000) {
      error = true
      msg = `File too large: ${Math.floor(
        first.size / 1048576,
        2
      )}mb when max size is 5mb`
      return false
    }

    ssb.addBlob(first)
      .then(hash => {
        content += ` ![${first.name}](${hash})`
        fileOnTop = false
      })
      .catch(err => {
        error = true 
        msg = "Couldn't attach file: " + err
        fileOnTop = false
      })
  }

  const post = async ev => {
    ev.stopPropagation()
    ev.preventDefault()

    saveToURL()

    if (!posting) {
      posting = true

      if (channel.length > 0 && channel.startsWith("#")) {
        channel = channel.slice(1)
      }

      try {
        let data = {}
        data.content = content
        if (typeof channel == "string" && channel.length > 0) data.channel = channel
        if (typeof title == "string" && title.length > 0) data.title = title
        if (typeof summary == "string" && summary.length > 0) data.summary = summary
        if (thumbnail) data.thumbnail = thumbnail
        if (typeof contentWarning == "string" && contentWarning.length > 0) data.contentWarning = contentWarning

        console.log("about to blog", data)
        msg = await ssb.newBlogPost(data)
        posting = false
        console.log("blogged", msg)
        window.scrollTo(0, 0)
      } catch (n) {
        error = true
        msg = `Couldn't post your blog: ${n}`
        window.scrollTo(0, 0)
      }
    }
  }

  const preview = ev => {
    showPreview = true
  }

  const saveToURL = ev => {
    let data = {}
    if (content) data.content = content
    if (channel) data.channel = channel
    if (summary) data.summary = summary
    if (thumbnail) data.thumbnail = thumbnail

    if (contentWarning.length > 0) data.contentWarning = contentWarning

    patchfox.emit("package:save:state", { pkg: "post", view: "compose", data })
  }

  const dragOver = ev => {
    fileOnTop = true
  }

  const dragLeave = ev => {
    fileOnTop = false
  }

  const attachFileTrigger = () => {
    document.getElementById("fileInput").click()
  }

  const attachThumbnailTrigger = () => {
    document.getElementById("thumbnailInput").click()
  }

  const attachFileIPFSTrigger = () => {
    document.getElementById("fileInputIPFS").click()
  }

  const attachFileDATTrigger = () => {
    document.getElementById("fileInputDAT").click()
  }

  const attachFile = ev => {
    const files = ev.target.files
    readFileAndAttach(files)
  }

  const attachThumbnail = ev => {
    const files = ev.target.files
    readFileAndAttachThumbnail(files)
  }

  const readFileAndAttachThumbnail = files => {
    error = false
    msg = ""

    if (files.length == 0) {
      console.log("this is not a file")
      return false
    }

    var first = files[0]
    console.log(first)

    if (!first.type.startsWith("image")) {
      error = true
      msg = `You can use images as thumbnail, this file is a ${first.type}`
      return false
    }

    if (first.size >= 5000000) {
      error = true
      msg = `File too large: ${Math.floor(
        first.size / 1048576,
        2
      )}mb when max size is 5mb`
      return false
    }

    ssb.addBlob(first)
      .then(hash => {
        thumbnail = hash
        fileOnTop = false
      })
      .catch(err => {
        error = true 
        msg = "Couldn't attach file: " + err
        fileOnTop = false
      })
  }

  const attachFileIPFS = ev => {
    const files = ev.target.files
    readFileAndAttachIPFS(files)
  }

  const attachFileDAT = ev => {
    const files = ev.target.files
    readFileAndAttachDAT(files)
  }

  const readFileAndAttachIPFS = async files => {
    error = false
    msg = ""

    var ipfs = window.IpfsHttpClient("127.0.0.1", "5001")
    const results = await ipfs.add(files[0])

    console.log("added via IPFS", results)
    content += ` [${results[0].path}](ipfs://${results[0].hash})`
  }

  let showContentWarningField = false

  const toggleContentWarning = () =>
    (showContentWarningField = !showContentWarningField)

  let contentWarning = ""
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

<div>
  {#if msg}
    {#if error}
      <div class="alert alert-error">{msg}</div>
    {:else}
      <div class="alert alert-success">
        <div class="flex-1">
        <label>
        Your blog post has been posted. Do you want to
        <a
          class="link"
          target="_blank"
          href="?pkg=hub&view=thread&thread={encodeURIComponent(msg.key)}">
          Check it out?
        </a>
      </label>
      </div>
      </div>
    {/if}
  {/if}
      {#if !showPreview}
        <div class="form-group" in:slide out:slide>
          <div class="form-control">
          <label class="label" for="channel">
            <span class="label-text">Channel</span>
          </label>
          <input
            class="input input-bordered"
            type="text"
            id="channel"
            placeholder="channel"
            bind:value={channel} />
          </div>

          <div class="form-control">
          <label class="label" for="title">
            <span class="label-text">Title</span>
          </label>
          <input
            class="input input-bordered"
            type="text"
            id="title"
            placeholder="title"
            bind:value={title} />
          </div>

          <div class="form-control">
          <label class="label" for="summary">
            <span class="label-text">Summary</span>
          </label>
          <textarea
            class="{textSize} textarea h-24 textarea-bordered"
            id="summary"
            placeholder="Type in your summary"
            on:dragover|preventDefault|stopPropagation={dragOver}
            on:dragleave|preventDefault|stopPropagation={dragLeave}
            class:file-on-top={fileOnTop}
            bind:value={summary} />
          </div>

          <div class="form-control">
          <label class="label" for="content">
            <span class="label-text">Content</span>
          </label>
          <textarea
            class="textarea h-96 textarea-bordered"
            id="content"
            placeholder="Type in your blog post content"
            on:dragover|preventDefault|stopPropagation={dragOver}
            on:dragleave|preventDefault|stopPropagation={dragLeave}
            class:file-on-top={fileOnTop}
            bind:value={content} />
          </div>

          <div class="block m-2">
            <button class="btn btn-link" on:click={toggleContentWarning}>
              CW
            </button>
            {#if showContentWarningField}
              <input
                class="input input-bordered"
                type="text"
                size="50"
                bind:value={contentWarning}
                placeholder="Describe your content warning (leave empty to no
                use it)" />
            {/if}
          </div>

          {#if thumbnail}
            <div class="block m-2">
              <p>Thumbnail</p>
              <img
                class="thumbnail-preview"
                src="{patchfox.blobUrl(thumbnail)}"
                alt="post thumbnail" />
            </div>
          {/if}

          <input type="file" on:input={attachThumbnail} id="thumbnailInput" />
          
          <button class="btn" on:click={attachThumbnailTrigger}>
            Attach Thumbnail Image
          </button>
          <input type="file" on:input={attachFile} id="fileInput" />
          
          <button class="btn" on:click={attachFileTrigger}>Attach File</button>
          
          <button class="btn btn-primary float-right" on:click={preview}>
            Preview
          </button>
        </div>
      {:else}
        <div>
          <Preview
            {channel}
            {title}
            {summary}
            {content}
            {contentWarning}
            {thumbnail} />
          <div class="divider" />
          <div class="alert alert-info">
            <div class="flex-1">
              <i class="fas fa-exclamation-triangle"></i>
              <label class="ml-2">
                This message will be public and can't be edited or deleted
              </label>
            </div>
            <div class="flex-none">
              <button class="btn mr-2" on:click={() => (showPreview = false)}>
                Go Back
              </button>
              <button
                class="btn btn-primary"
                class:loading={posting}
                disabled={!error && typeof msg.key == "string"}
                on:click={post}>
                Post
              </button>
            </div>
          </div>
        </div>
      {/if}
</div>
