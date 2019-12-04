<script>
    document.title = `Patchfox - Error`;

    export let error = {};
    export let currentPackage = {};
    let errorObj = {};
    let toastClass = "";
    let toast = false;
    let msg;
    let cta = false;

    console.log(error);
    if (typeof error == "object") {
        errorObj = error;
        error = errorObj.message;
    }


    let errorMapping = {
        "Error: stream is closed": {
            label: "Want to try to reconnect?",
            action: () => console.log("action!")
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
    <p>It has happened in package: {currentPackage.name}.</p>
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
    <p>Do you want to see the source code for the current package (requires an internet connection)?</p>
    <ul>
        <li>
            <a href="https://git.sr.ht/~soapdog/patchfox/tree/mad-science-scheme/src/packages/{currentPackage.name}/{currentPackage.name}.js">
                view package <b>{currentPackage.name}</b> on sourcehut.
            </a>
        </li>
    </ul>
</div>
