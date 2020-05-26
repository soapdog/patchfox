<script>
  const MoreInfoField = require("./MoreInfoField.svelte");

  let fieldTypes = [
  "URL",
  "email",
  "phone",
  "text",
  ];

  let currentFields = [];

  let newFieldName = "";
  let newFieldType = fieldTypes[0];
  let newFieldValue = "";
  let saving = false;
  let dirty = false;

  const addNewField = () => {
    dirty = true;
    let newField = {
      name: newFieldName,
      type: newFieldType,
      value: newFieldValue
    };

    currentFields.push(newField);
    currentFields = currentFields; // needed for svelte to remember to update the view.
  };

  const save = () => {};
</script>

<div>
  <div class="current-fields">
    {#if dirty}
    <div class="toast toast-warning">
      Your edits are not saved. Remember to press the <em>Save</em> button to save them.
    </div>
    <br>
    {/if}
    {#if currentFields.length > 0}
    <button class="float-right btn btn-link">Export to vCard</button>
    {/if}
    <table class="table table-striped table-hover">
      <tbody>
        {#each currentFields as field}
        <MoreInfoField {field} />
        {/each}
      </tbody>
    </table>
  {#if dirty}
  <button class="btn mt-2" on:click={save}>Save</button>
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
      <select 
      class="form-select"
      bind:value={newFieldType}>
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
