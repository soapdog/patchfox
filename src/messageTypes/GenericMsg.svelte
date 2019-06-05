<script>
  export let msg;

  let rawContent = JSON.stringify(msg, null, 2);
</script>

<div class="card-body">
  <pre class="code">
    <code> {rawContent} </code>
  </pre>
</div>
