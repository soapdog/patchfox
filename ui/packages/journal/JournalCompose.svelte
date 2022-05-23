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

  export let content = ""

  let fileOnTop = false
  let sbot = ssb.sbot
  let showContentWarningField = false
  let contentWarning = ""
  let showPreview = false
  let msg = false
  let error = false
  let posting = false
  let branchedMsg = false
  let textSize = getPref("composeSize", "text")

  patchfox.title(`New Journal Entry`)

  onMount(() => {
    error = false
    msg = ""

    // this code could be in some better/smarter place.
    // e.dataTransfer.getData('url') from images in the browser window

    drop(document.getElementById("content"), files => readFileAndAttach(files))
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

      if (!first.type.startsWith("image") &&  !first.type.startsWith("video") && !first.type.startsWith("audio")) {
        error = true
        msg = `You can only drag & drop images, videos, or audio, this file is a ${first.type}`
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
          switch(first.type) { 
          case "image/png":
          case "image/jpeg":
          case "image/gif":
          case "image/svg":
            content += ` ![${first.name}](${hash})`
            break
          case "video/mp4":
            content += ` ![video:${first.name}](${hash})`
            break
          case "audio/mp3":
            content += ` ![audio:${first.name}](${hash})`
            break
          }
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

      try {
        let data = {
          type: "post",
          recps: [ssb.feed],
        }

        data.text = content

        msg = await ssb.publish(data)
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

      <div class="form-control mb-2">
      <label class="label" for="content"><span class="label-text">Entry</span></label>
      <textarea
        class="{textSize} textarea textarea-bordered h-96"
        id="content"
        placeholder="Type in your journal entry"
        on:dragover|preventDefault|stopPropagation={dragOver}
        on:dragleave|preventDefault|stopPropagation={dragLeave}
        class:file-on-top={fileOnTop}
        bind:value={content} />
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
