<script>
  export let msg;

  let type;

  if (typeof msg.value.content === "string") {
    type = "private";
  } else {
    type = msg.value.content.type;
  }

  let raw = JSON.stringify(msg, null, 4);

  let pkg = patchfox.packageForType(msg);
</script>

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
      <a class="link link-accent" target="_blank" href="/docs/index.html#/message_types/{type}">
        the documentation about messages with type {type}
      </a>
      .
    </p>
    {#if pkg}
      <p>
        This message is being handled by the <b>{pkg.name} Package</b>.
        <a class="link link-accent" target="_blank" href="/docs/index.html#/packages/{pkg.name}/">
          Click here to check more about it.
        </a>
      </p>
      <p>Do you want to see the source-code for this package?</p>

      <ul>
        <li>
          <a class="link" target="_blank" href="https://github.com/soapdog/patchfox/blob/master/src/packages/{pkg.name}/">
            See source for <b>{pkg.name} package</b> at GitHub.
          </a>
        </li>
        <li>
          <a class="link" target="_blank" href="https://git.sr.ht/~soapdog/patchfox/tree/master/item/src/packages/{pkg.name}/">
            See source for <b>{pkg.name} package</b> at SourceHut.
          </a>
        </li>
      </ul>
    {/if}
  </div>
</div>

<style>
  .container {
    overflow: scroll;
  }
</style>
