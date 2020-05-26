<script>
  export let field = {
    name: "",
    type: "",
    value: ""
  };

  let editing = false;
</script>

<tr>
  {#if editing}

  {:else}
  <td class="column">{field.name}</td>
  <td class="column">{field.type}</td>
  <td class="column">
    {#if field.type == "URL"}
    <a target="_blank" href="{field.value}">{field.value}</a>
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
    <a href="">Edit</a>
  </td>
  {/if}
</tr>

