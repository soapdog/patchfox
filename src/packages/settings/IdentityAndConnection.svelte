<script>
    const {
        getPref,
        setPref,
        setConnectionConfiguration
    } = patchfox;
    let keys = {};
    let remote = "";
    document.title = "Patchfox - Settings - Identity And Connection";

    const saveConfiguration = ev => {
        setConnectionConfiguration({remote, keys: JSON.parse(keys)});
        location.reload();
    };

    const selectedFile = ev => {
        const secretFile = ev.target.files[0];
        const reader = new FileReader();
        reader.onload = function (evt) {
            const contents = evt.target.result;
            let secret = contents.split("\n").filter(function (line) {
                return line.indexOf("#") != 0;
            });
            secret = JSON.parse(secret.join("\n"));
            remote = `ws://localhost:8989~shs:${secret.id.slice(
                    1,
                    secret.id.indexOf("=") + 1
            )}`;
            updateUI({keys: secret, remote});
        };
        reader.readAsText(secretFile);
    };

    const updateUI = savedData => {
        console.log("saved data from settings", savedData);
        remote = savedData.remote || "";
        if (savedData.keys) {
            keys = JSON.stringify(savedData.keys, null, 2);
        } else {
            keys = "";
        }
    };

    const onError = error => {
        console.error("error on settings", error);
    };

    const gettingStoredSettings = browser.storage.local
            .get()
            .then(updateUI, onError);
</script>

<h1>Identity &amp; Connection</h1>
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
        is hidden in most systems and it might be hard to find on your machine. If
        you have used Secure Scuttlebutt before and already have an identity but
        can't find a folder named
        <code>.ssb</code>
        inside your home folder, go to
        <a
                href="/docs/index.html#/troubleshooting/no-configuration"
                target="_blank">
            this link to learn more about how to display hidden folders and setup
            Patchfox
        </a>
        .
    </b>
</p>

<form class="form-group">
    <label class="form-label" for="secret-file">
        Use the button below to select your secret file (usually located at
        <code>~/.ssb/secret</code>
        ).
    </label>
    <input
            type="file"
            class="form-input"
            id="secret-file"
            on:change={selectedFile}/>
    <label class="form-label" for="remote">Remote</label>
    <input
            class="form-input"
            type="text"
            id="remote"
            placeholder="remote"
            bind:value={remote}/>

    <label class="form-label" for="secret">Secret</label>
    <textarea
            class="form-input"
            id="secret"
            placeholder="Your secret"
            rows="8"
            bind:value={keys}/>
    <br/>
    <button class="btn btn-primary float-right" on:click={saveConfiguration}>
        Save Identity & Remote
    </button>
    <p>Saving identity and remote will cause a full page refresh.</p>
</form>
