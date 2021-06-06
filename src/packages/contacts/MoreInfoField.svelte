<script>
  const { createEventDispatcher } = require("svelte");
  const dispatch = createEventDispatcher();

  export let field = {
    name: "",
    type: "",
    value: ""
  };

  export let index;

  const deleteField = ev => {
    if (
      confirm(
        `Are you sure you want to remove ${field.type} ${field.name}: ${field.value}?`
      )
    ) {
      dispatch("deleteField", { index });
    }
  };
</script>

<tr>
  <td class="column">{field.name}</td>
  <td class="column">{field.type}</td>
  <td class="column">
    {#if field.type == "URL"}
      <a target="_blank" href={field.value}>{field.value}</a>
    {/if}

    {#if field.type == "email"}
      <a target="_blank" href="mailto:{field.value}">{field.value}</a>
    {/if}

    {#if field.type == "phone"}
      <a target="_blank" href="tel:{field.value}">{field.value}</a>
    {/if}

    {#if field.type == "text"}
      <span>{field.value}</span>
    {/if}
  </td>
  <td class="column">
    <button class="btn btn-link" on:click={deleteField}>delete</button>
  </td>
</tr>
