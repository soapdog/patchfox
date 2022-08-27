<script>
  const { getPref, setPref, saveIdentityConfiguration, setDefaultIdentity, removeIdentity } = patchfox
  import AvatarChip from "../../core/components/AvatarChip.svelte"

  let keys = ""
  let remote = ""
  let type = "nodejs-db1"
  let identities = []
  let savedData

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
    // browser.storage.local.get().then(updateUI, onError)
  }

  reloadSavedConfiguration()
</script>

<div class="prose">
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
</div>
<!-- List identities -->
<div class="mt-4">
{#each Object.keys(identities) as key}
<div class="card shadow-sm bg-accent text-accent-content mb-4">
  <div class="card-body">
    {#if window.ssb}
    <AvatarChip feed={"@" + identities[key].keys.public} />
    {:else}
    <h5 class="card-title">{identities[key].keys.public}</h5>
    {/if}
  <ul class="text-sm list-disc">
    <li>Feed Id: <span class="font-ultrathin">{identities[key].keys.public}</span></li>
    <li>Server Type: <span class="font-ultrathin">{identities[key].type}</span></li>
    <li>Remote: <span class="font-ultrathin">{identities[key].remote}</span></li>
  </ul>
  <div class="card-actions">
    <button class="btn" on:click={() => {
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
    <button class="btn btn-error" on:click={ ()=> {
      removeIdentity(key)
      reloadSavedConfiguration()
    }}>Remove</button>
    <button class="btn" on:click={() => {
      window.open(patchfox.url("settings","view",{identity: identities[key].keys.public}))
    }}>Open in new tab</button>
  </div>
</div>
</div>
{:else}
  <div class="prose text-center">
      <h2 class="card-title h2">No identities saved</h2>
      <p>You haven't saved any SSB identity yet.</p>
  </div>
{/each}
</div>
<!-- Add identity -->
<form>
  <div class="form-control">
    <label class="label" for="secret-file">
      <span class="label-text">Use the button below to select your secret file (usually located at
      <code>~/.ssb/secret</code>
      ).</span>
    </label>
    <input type="file" class="input" id="secret-file" on:change="{selectedFile}" />
  </div>

  <div class="form-control">
    <label class="label" for="remote"><span class="label-text">Remote</span></label>
  <input class="input input-bordered" type="text" id="remote" placeholder="remote" bind:value="{remote}" />
</div>

  <div class="form-control">
    <label class="label" for="secret"><span class="label-text">Secret</span></label>
  <textarea class="textarea textarea-bordered h-48" id="secret" placeholder="Your secret" bind:value="{keys}" />
</div>

  <br />
  <div class="form-control">
    <select class="select" bind:value="{type}">
      <option value="nodejs-db1">NodeJS-based SSB Server (Patchwork, Scuttle Shell...)</option>
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
