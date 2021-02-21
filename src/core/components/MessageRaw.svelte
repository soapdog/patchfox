<script>
  export let msg;

  let type;

  if (typeof msg.value.content === "string") {
    type = "private";
  } else {
    type = msg.value.content.type;
  }

  let raw = JSON.stringify(msg, null, 4)
</script>

<style>
.container {
    overflow: scroll;
}
</style>

<div class="columns">
  <div class="column col-9">
    <pre class="container">
      {@html raw}
    </pre>
  </div>
  <div class="column col-3">
    <p>
      This is a message of type
      <em>{type}</em>
      .
    </p>
    <p>
      To learn more about it, go to
      <a target="_blank" href="/docs/index.html#/message_types/{type}">
        the documentation about messages with type {type}
      </a>
      .
    </p>
  </div>
</div>
