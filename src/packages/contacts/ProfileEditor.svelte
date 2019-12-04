<script>
  const { createEventDispatcher } = require("svelte");
  const pull = require("pull-stream");
  const fileReader = require("pull-file-reader");

  const dispach = createEventDispatcher();

  export let description;
  export let name;
  export let image;
  export let feed;

  let submitting = false;
  let sbot = ssb.sbot;

  const save = () => {
    let data = { name, description, image: { link: image } };
    submitting = true;
    ssb
      .setProfileMetadata(data)
      .then(res => {
        console.log("res", res);
        location.reload();
      })
      .catch(err => {
        console.err("err", err);
      });
  };

  const readFileAndAttach = files => {
    try {
      if (files.length == 0) {
        return false;
      }

      var first = files[0];
      console.log(first);

      if (!first.type.startsWith("image")) {
        alert(`You can only drag & drop image, this file is a ${first.type}`);
        return false;
      }

      if (first.size >= 5000000) {
        alert(
          `File too large: ${Math.floor(
            first.size / 1048576,
            2
          )}mb when max size is 5mb`
        );
        return false;
      }

      pull(
        fileReader(first),
        sbot.blobs.add(function(err, hash) {
          if (err) {
            alert("Couldn't attach file: " + err);
          } else {
            image = hash;
          }
        })
      );
    } catch (n) {
      console.error("error, attaching", n);
    }
  };

  const attachFile = ev => {
    const files = ev.target.files;
    readFileAndAttach(files);
  };
</script>

<div class="columns">

  <div class="column col-6">
    <div class="container">
      <img
        class="img-responsive"
        src={patchfox.httpUrl('/blobs/get/' + image)}
        alt={feed} />
    </div>
    <input
      class="btn btn-link text-center"
      type="file"
      on:input={attachFile}
      id="fileInput" />
  </div>
  <div class="column col-6">
    <span class="chip">📝 Editing Your Profile 📝</span>
    <form on:submit|preventDefault={save}>
      <div class="form-group">
        <label class="form-label" for="name">Name</label>
        <input
          class="form-input"
          type="text"
          id="name"
          bind:value={name}
          placeholder="Name" />
      </div>
      <div class="form-group">
        <label class="form-label" for="description">Description</label>
        <textarea
          class="form-input"
          id="description"
          placeholder="Your description"
          bind:value={description}
          rows="6" />
      </div>
      <div class="columns">
        <button class="btn column m-2" on:click={() => dispach('cancelEdit')}>
          Cancel
        </button>
        <input
          id="save-button"
          type="submit"
          class="btn btn-primary column m-2"
          class:loading={submitting}
          value="Save" />
      </div>
    </form>
  </div>
</div>
