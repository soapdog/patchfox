<script>
  const { onMount } = require("svelte")
  const drop = require("drag-and-drop-files")
  const { slide } = require("svelte/transition")
  const AvatarChip = require("../../core/components/AvatarChip.svelte")
  const MessageRenderer = require("../../core/components/MessageRenderer.svelte")
  const Spinner = require("../../core/components/Spinner.svelte")

  const { getPref } = require("../../core/kernel/prefs.js")
  const pull = require("pull-stream")
  const fileReader = require("pull-file-reader")
  const Tribute = require("tributejs")

  export let root = false
  export let branch = false
  export let channel = ""
  export let content = ""
  export let replyfeed = false
  export let fork = false

  let fileOnTop = false
  let sbot = ssb.sbot
  let showContentWarningField = false
  let contentWarning = ""
  let showPreview = false
  let msg = false
  let error = false
  let posting = false
  let branchedMsg = false

  patchfox.title(`New Post`)

  if (branch) {
    ssb.get(branch).then(data => (branchedMsg = { key: branch, value: data }))
  }

  onMount(() => {
    error = false
    msg = ""

    // this code could be in some better/smarter place.
    // e.dataTransfer.getData('url') from images in the browser window

    drop(document.getElementById("content"), files => readFileAndAttach(files))

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

    if (replyfeed && content.length == 0) {
      content = `[${usersObjs[replyfeed].name}](${replyfeed}),\n`
    }
  })

  const readFileAndAttach = files => {
    try {
      error = false
      msg = ""

      if (files.length == 0) {
        fileOnTop = false
        return false
      }

      var first = files[0]
      console.log(first)

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
    } catch (n) {
      console.error("error, attaching", n)
    }
  }

  const post = async ev => {
    ev.stopPropagation()
    ev.preventDefault()

    if (!posting) {
      saveToURL()
      posting = true

      if (channel && channel.length > 0 && channel.startsWith("#")) {
        channel = channel.slice(1)
      }

      try {
        let data = {}
        data.text = content
        if (typeof channel == "string" && channel.length > 0) data.channel = channel
        if (root) data.root = root
        if (fork) data.fork = fork
        if (branch) data.branch = branch
        if (typeof contentWarning == "string" && contentWarning && contentWarning.length > 0) data.contentWarning = contentWarning

        msg = await ssb.newPost(data)
        posting = false
        window.scrollTo(0, 0)
      } catch (n) {
        error = true
        msg = `Couldn't post your message: ${n}`
        console.error("Couldn't post", n)
        window.scrollTo(0, 0)

        if (msg.message === "stream is closed") {
          msg += ". We lost connection to SSB Server. We'll try to restablish it..."
          window.reload()
        }
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
    if (root) data.root = root
    if (branch) data.branch = branch
    if (fork) data.fork = fork
    if (contentWarning.length > 0) data.contentWarning = contentWarning

    patchfox.emit("package:save:state", { pkg: "post", view: "compose", data })
  }

  const avatarClick = ev => {
    let feed = ev.detail.feed
    let name = ev.detail.name

    if (content.length > 0) {
      content += ` [${name}](${feed})`
    } else {
      content = `[${name}](${feed})`
    }
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

  const attachFile = ev => {
    const files = ev.target.files
    readFileAndAttach(files)
  }

  const toggleContentWarning = () =>
    (showContentWarningField = !showContentWarningField)
</script>

<style>
  .file-on-top {
    border: solid 2px rgb(26, 192, 11);
  }

  input[type="file"] {
    display: none;
  }
</style>

<div class="container mx-auto">
  {#if fork}
    <div class="alert alert-warning">You are forking: {fork}</div>
  {/if}
  {#if msg}
    {#if error}
      <div class="alert alert-error">{msg}</div>
    {:else}
      <div class="alert alert-success">
        <div class="flex-1">
        <label>
        Your message has been posted. Do you want to
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
    <div in:slide out:slide>
      <div class="form-control">
      <label class="label" for="channel"><span class="label-text">Channel</span></label>
      <input
        class="input input-bordered"
        type="text"
        id="channel"
        placeholder="channel"
        bind:value={channel} />
      </div>

      {#if branch}
      <div class="form-control">
        <label class="label" for="reply-to"><span class="label-text">In reply to</span></label>
        <input
          class="input input-bordered"
          type="text"
          id="reply-to"
          placeholder="in reply to"
          bind:value={branch} />
        </div>
        {#if branchedMsg}
          <MessageRenderer msg={branchedMsg} />
        {:else}
          <Spinner />
        {/if}
      {/if}

      <div class="form-control">
      <label class="label" for="content"><span class="label-text">Message</span></label>
      <textarea
        class="textarea textarea-bordered h-96"
        id="content"
        placeholder="Type in your post"
        on:dragover|preventDefault|stopPropagation={dragOver}
        on:dragleave|preventDefault|stopPropagation={dragLeave}
        class:file-on-top={fileOnTop}
        bind:value={content} />
      </div>

      <div class="d-block m-1">
        <button class="btn btn-link" on:click={toggleContentWarning}>
          Add Content Warning
        </button>
        {#if showContentWarningField}
          <input
            class="input input-bordered"
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
    <div>
      <h2 class="uppercase font-medium text-md">Post preview</h2>
      <div class="prose">
      {#if channel || root || branch || contentWarning.length > 0}
          {#if channel}
            <p>
              <b>Channel:</b>
              {channel.startsWith("#") ? channel.slice(1) : channel}
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
      {/if}

      {@html ssb.markdown(content)}
      </div>

      <div class="divider" />
      <div class="alert alert-warning">
        <div class="flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mx-2 stroke-current"> 
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>                         
            </svg> 
          <label>This message will be public and can't be edited or deleted</label>
        </div>

        <div class="flex-none">
        <button class="btn btn-sm btn-ghost" on:click={() => (showPreview = false)}>
          Go Back
        </button>
        <button
          class="btn btn-sm btn-primary ml-2"
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
