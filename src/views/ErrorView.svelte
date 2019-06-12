<script>
  import { navigate, routeParams, reconnect } from "../utils.js";

  let error = $routeParams.error;
  let toastClass = "";
  let toast = false;
  let msg;
  let cta = false;

  const tryReconnect = () => {
    toast = true;
    toastClass = "toast-warning";
    msg = "Attempting to reconnect to sbot...";
    reconnect()
      .then(() => {
        toastClass = "toast-success";
        toast = true;
        msg =
          "Connection to sbot reestablished. Try going to your public feed.";
      })
      .catch(n => {
        toastClass = "toast-error";
        toast = true;
        msg = "Couldn't reconnect. Try reloading the page.";
      });
  };

  let errorMapping = {
    "Error: stream is closed": {
      label: "Want to try to reconnect?",
      action: tryReconnect
    }
  };

  if (errorMapping.hasOwnProperty(error)) {
    cta = errorMapping[error];
  }
</script>

<div class="container">
  <h1>😿 An Error Has Occurred, sorry 😭</h1>
  {#if toast}
    <div class="toast {toastClass}">{msg}</div>
  {/if}
  <h4>This is what we know about it</h4>
  <pre class="code">
    <code>{error}</code>
  </pre>
  <p>You might want to:</p>
  <ul>
    {#if cta}
      <li>
        <a href="#" on:click|stopPropagation|preventDefault={cta.action}>
           {cta.label}
        </a>
      </li>
    {/if}
    <li>
      <a href="/docs/index.html#/troubleshooting/" target="_blank">
        Open our troubleshooting documentation.
      </a>
    </li>
    <li>
      <a href="https://github.com/soapdog/patchfox/issues" target="_blank">
        Add an issue
      </a>
      to the Patchfox repository.
    </li>
  </ul>
</div>
