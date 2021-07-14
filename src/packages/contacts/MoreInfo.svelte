<script>
  const MoreInfoField = require("./MoreInfoField.svelte")
  const pull = require("pull-stream")
  const _ = require("lodash")

  export let feed

  let fieldTypes = ["URL", "email", "phone", "text"]

  let currentFields = []

  let newFieldName = ""
  let newFieldType = fieldTypes[0]
  let newFieldValue = ""
  let saving = false
  let dirty = false
  let error = false
  let msg = false
  let loading = true

  let filter = {
    value: {
      author: ssb.feed,
      content: {
        type: "more-info",
        about: feed
      }
    }
  }

  pull(
    ssb.sbot.query.read({
      query: [
        {
          $filter: filter
        }
      ],
      reverse: true,
      limit: 1
    }),
    pull.collect((err, data) => {
      loading = false
      if (err) {
        console.error("more-info", err)
        error = err
      } else {
        console.log("more-info", data)
        let fields = _.get(data[0], "value.content.fields", [])
        if (fields.length > 0) {
          currentFields = fields
        }
      }
    })
  )

  const addNewField = () => {
    dirty = true
    let newField = {
      name: newFieldName,
      type: newFieldType,
      value: newFieldValue
    }

    currentFields.push(newField)
    currentFields = currentFields // needed for svelte to remember to update the view.
  }

  const save = async ev => {
    ev.stopPropagation()
    ev.preventDefault()
    saving = true
    try {
      // lucky numbers are 5 random cryptographically safe integers that
      // are added to each more info message. They are there just to make it
      // harder to brute-force decryption by assuming the structure and values
      // inside the message.
      let luckyNumbers = new Uint32Array(5)
      window.crypto.getRandomValues(luckyNumbers)

      let data = {
        type: "more-info",
        about: feed,
        fields: currentFields,
        luckyNumbers,
        recps: [ssb.feed]
      }

      console.log("about to post", data)
      msg = await ssb.publish(data)
      console.log("more-info", msg)
      saving = false
      error = false
      dirty = false
    } catch (n) {
      console.error("Couldn't post", n)
      saving = false
      error = n.toString()
    }
  }

  const deleteField = ev => {
    console.log("delete", ev)
    let index = new Number(ev.detail.index)
    if (!isNaN(index)) {
      currentFields.splice(index, 1)
      currentFields = currentFields
      dirty = true
    }
  }
</script>

<div>
  {#if error}
    <div class="toast toast-error">
      An error happening when saving the new information: {error.message}.
    </div>
    <br />
  {/if}
  {#if msg && !dirty}
    <div class="toast toast-success">Information saved.</div>
    <br />
  {/if}
  {#if dirty}
    <div class="toast toast-warning">
      Your edits are not saved. Remember to press the
      <em>Save</em>
      button to save them.
    </div>
    <br />
  {/if}
  <div class="current-fields">
    {#if loading}
      <div class="loading" />
    {:else}
      <!-- {#if currentFields.length > 0}
        <button class="float-right btn btn-link">Export to vCard</button>
      {/if} -->
      <table class="table table-striped table-hover">
        <tbody>
          {#each currentFields as field, index}
            <MoreInfoField {field} {index} on:deleteField={deleteField} />
          {/each}
        </tbody>
      </table>
      {#if dirty}
        <button class="btn mt-2" class:loading={saving} on:click={save}>
          Save
        </button>
      {/if}
    {/if}
  </div>
  <div class="more-fields">
    <h2 class="title">Add new field</h2>
    <form on:submit|preventDefault={addNewField}>
      <div class="form-group">
        <label class="form-label" for="field-name">Name</label>
        <input
          class="form-input"
          type="text"
          id="field-name"
          bind:value={newFieldName}
          placeholder="Field Name" />
      </div>
      <div class="form-group">
        <label class="form-label" for="field-type">Type</label>
        <select class="form-select" bind:value={newFieldType}>
          {#each fieldTypes as type}
            <option value={type}>{type}</option>
          {/each}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="field-value">Value</label>
        <input
          class="form-input"
          type="text"
          id="field-value"
          bind:value={newFieldValue}
          placeholder="" />
      </div>
      <input
        id="save-field-button"
        type="submit"
        class="btn btn-primary mt-2"
        class:loading={saving}
        disabled={saving}
        value="Add" />
    </form>
  </div>
</div>
