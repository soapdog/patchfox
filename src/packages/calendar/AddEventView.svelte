<script>
  const Scuttle = require("scuttle-gathering")
  const gathering = Scuttle(ssb.sbot)
  const pull = require("pull-stream")
  const fileReader = require("pull-file-reader")


  let title = ""
  let startDateTime = Date()
  let progenitor = null
  let description = ""
  let location = null
  let image = null 
  let mentions = null 
  let recps = null
  let error
  let msg
  let posting = false


  const createEvent = async (ev) => {
    ev.preventDefault()
    ev.stopPropagation()

    let epoch = new Date(startDateTime).getTime()

    let opts = {
      title: title,
      description: description,
      startDateTime: {
        epoch: epoch
      },
      image: image
    }

    console.log("begin create event")

    // build opts

    const callback = (err, gathering) => {
      if (err) {
        error = true
        msg = err
        return
      }

      if (gathering) {
        console.dir("gathering", gathering)

        patchfox.go("calendar", "gathering", { msgid: gathering.key })
      }
    }

    gathering.post(opts, callback)

  }

  const attachFileTrigger = (ev) => {
    ev.preventDefault()
    ev.stopPropagation()

    document.getElementById("fileInput").click()
  }

  const attachFile = ev => {
    const files = ev.target.files
    readFileAndAttach(files)
  }

  const readFileAndAttach = files => {
    console.log("begin image attach")
    error = false
    msg = ""

    if (files.length == 0) {
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
        console.log("attached", image)

         image =  {         
            link: hash,
            name: `${title} event banner` ,      
            type: first.type
          }
      })
      .catch(err => {
        error = true 
        msg = "Couldn't attach file: " + err
      })
  }

  patchfox.title("Add Event")
</script>
<style>
input[type=file] {
  display:none;
}

img.gathering-image {
  max-width: 200px;
}
</style>


<div class="container mx-auto">
  {#if error}
    <div class="alert alert-error">{msg}</div>
  {/if}

  <form>
    <div class="form-control">
      <label class="label" for="title">
        <span class="label-text">Title</span>
      </label>
      <input
        class="input input-bordered"
        type="text"
        id="title"
        placeholder="title for the event"
        bind:value={title} />
    </div>

    <div class="form-control">
      <label class="label" for="startDateTime">
        <span class="label-text">Date</span>
      </label>
      <input
        class="input input-bordered"
        type="datetime-local"
        id="startDateTime"
        placeholder="date for the event"
        bind:value={startDateTime} />
    </div>

    <div class="form-control">
      <label class="label" for="description"><span class="label-text">Description</span></label>
      <textarea
        class="textarea textarea-bordered h-48"
        id="description"
        placeholder="Type in your descriptions"
        bind:value={description} />
    </div>
    <br>

    <input type="file" on:input={attachFile} id="fileInput" />
    <button class="btn" on:click={attachFileTrigger}>Attach Image</button>

    {#if image}
    <br>
    <h1>Event banner</h1>
      <img
        class="gathering-image"
        src="{patchfox.blobUrl(encodeURIComponent(image.link))}"
        alt={image.name} />
    {/if}

    <button
          class="btn btn-sm btn-primary ml-2"
          class:loading={posting}
          disabled={error}
          on:click={createEvent}>
          Create Event
        </button>
  </form>

</div>
