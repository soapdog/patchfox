<script>
  const { getPref, setPref, saveIdentityConfiguration, setDefaultIdentity } = patchfox
  const AvatarChip = require("../../core/components/AvatarChip.svelte")

  let keys = ""
  let remote = ""
  let type = "nodejs-ssb"
  let identities = []
  let savedData

  patchfox.title("Settings - Identities And Connections")

  const saveConfiguration = ev => {
    saveIdentityConfiguration({ remote, keys: JSON.parse(keys), type })
    location.reload()
  }

  const selectedFile = ev => {
    const secretFile = ev.target.files[0]
    const reader = new FileReader()
    reader.onload = function (evt) {
      const contents = evt.target.result
      let secret = contents.split("\n").filter(function (line) {
        return line.indexOf("#") != 0
      })
      secret = JSON.parse(secret.join("\n"))
      remote = `ws://localhost:8989~shs:${secret.id.slice(1, secret.id.indexOf("=") + 1)}`
      keys = JSON.stringify(secret, null, 2)
    }
    reader.readAsText(secretFile)
  }

  const updateUI = data => {
    console.log("saved data from settings", data)
    savedData = data
    identities = data.identities || []
  }

  const onError = error => {
    console.error("error on settings", error)
  }

  const reloadSavedConfiguration = () => {
    browser.storage.local.get().then(updateUI, onError)
  }

  reloadSavedConfiguration()
</script>

<h1>Identities &amp; Connections</h1>
<p>
  <b>
    You can't use Patchfox until you fill your
    <i>Identity &amp; Connection</i>
    information. Patchfox can infer the values for both
    <i>remote</i>
    and
    <i>secret</i>
    from your
    <code>~/.ssb/secret</code>
    file. The main problem is that the folder
    <code>.ssb</code>
    is hidden in most systems and it might be hard to find on your machine. If you have used Secure
    Scuttlebutt before and already have an identity but can't find a folder named
    <code>.ssb</code>
    inside your home folder, go to
    <a href="/docs/index.html#/troubleshooting/no-configuration" target="_blank">
      this link to learn more about how to display hidden folders and setup Patchfox
    </a>
    .
  </b>
</p>
<!-- List identities -->
<div>
{#each Object.keys(identities) as key}
<div class="card">
  <div class="card-header">
    {#if window.ssb}
    <AvatarChip feed={"@" + identities[key].keys.public} />
    {:else}
    <h5 class="card-title h5">{identities[key].keys.public}</h5>
    {/if}
  </div>
  <ul class="card-body text-tiny">
    <li>Feed Id: <code>{identities[key].keys.public}</code></li>
    <li>Server Type: <code>{identities[key].type}</code></li>
    <li>Remote: <code>{identities[key].remote}</code></li>
  </ul>
  <div class="card-footer">
    <button class="btn btn-primary" on:click={() => {
      keys = JSON.stringify(identities[key].keys)
      remote = identities[key].remote
      type = identities[key].type
    }}>Edit</button>
    {#if identities[key].keys.public === savedData.defaultIdentity}
    <button class="btn btn-primary">This is the default identity</button>
    {:else}
    <button class="btn" on:click={() => {
      setDefaultIdentity(identities[key].keys.public)
      reloadSavedConfiguration()
    }}>Set as default</button>
    {/if}
    <button class="btn btn-error">Remove</button>
    <button class="btn" on:click={() => {
      window.open(patchfox.url("settings","view",{identity: identities[key].keys.public}))
    }}>Open in new tab</button>
  </div>
</div>
{:else}
  <div class="card">
    <div class="card-header">
      <h5 class="card-title h5">No identities saved</h5>
    </div>
    <div class="card-body">
      <p>You haven't saved any SSB identity yet.</p>
    </div>
  </div>
{/each}
</div>
<!-- Add identity -->
<form class="form-group">
  <label class="form-label" for="secret-file">
    Use the button below to select your secret file (usually located at
    <code>~/.ssb/secret</code>
    ).
  </label>
  <input type="file" class="form-input" id="secret-file" on:change="{selectedFile}" />
  <label class="form-label" for="remote">Remote</label>
  <input class="form-input" type="text" id="remote" placeholder="remote" bind:value="{remote}" />

  <label class="form-label" for="secret">Secret</label>
  <textarea class="form-input" id="secret" placeholder="Your secret" rows="8" bind:value="{keys}" />
  <br />
  <div class="form-group">
    <select class="form-select" bind:value="{type}">
      <option value="nodejs-ssb">NodeJS-based SSB Server (Patchwork, Scuttle Shell...)</option>
      <option value="browser-ssb">Browser-SSB Server</option>
      <option value="go-ssb">Go-SSB</option>
    </select>
  </div>
  <br />
  <button class="btn btn-primary float-right" on:click="{saveConfiguration}">
    Save Identity & Remote
  </button>
  <p>Saving identity and remote will cause a full page refresh.</p>
</form>
