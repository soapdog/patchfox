const m = require("mithril")
const Stream = require("mithril/stream")
const manifest = require("../../core/platforms/ssb/manifest.js")

const {
    getPref,
    setPref,
    setConnectionConfiguration
} = patchfox;

class IdentityAndConnection {
    constructor() {
        this.keys = Stream("")
        this.remote = Stream("")
    }

    oncreate() {
        const gettingStoredSettings = browser.storage.local
            .get()
            .then(this.updateUI.bind(this), this.onError);
    }

    saveConfiguration(ev) {
        setConnectionConfiguration({ remote: this.remote(), keys: JSON.parse(this.keys()), manifest });
        location.reload();
    };

    selectedFile(ev) {
        const secretFile = ev.target.files[0];
        const reader = new FileReader();
        reader.onload = (evt) => {
            const contents = evt.target.result;
            let secret = contents.split("\n").filter(function(line) {
                return line.indexOf("#") != 0;
            });
            secret = JSON.parse(secret.join("\n"));
            let remote = `ws://localhost:8989~shs:${secret.id.slice(
                    1,
                    secret.id.indexOf("=") + 1
            )}`;
            this.updateUI({ keys: secret, remote });
        };
        reader.readAsText(secretFile);
    };

    updateUI(savedData) {
        console.log("saved data from settings", savedData);
        this.remote(savedData.remote || "");
        if (savedData.keys) {
            this.keys(JSON.stringify(savedData.keys, null, 2));
        } else {
            this.keys("");
        }
        m.redraw()
    };

    onError(error) {
        console.error("error on settings", error);
    };

    view(vnode) {
        document.title = "Patchfox - Settings - Identity And Connection";
        let blurb = `
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
        `

        return [
            m.trust(blurb),
            m("form.form-group", [
                m("label.form-label[for=secret-file]", m.trust(" Use the button below to select your secret file (usually located at <code>~/.ssb/secret</code>).")),
                m("input#secret-file.form-input[type=file]", { onchange: this.selectedFile.bind(this) }),
                m("label.form-label[for=remote]", "Remote"),
                m("input#remote.form-input", { placeholder: "remote", onchange: this.remote, value: this.remote() }),
                m("label.form-label[for=secret]", "Secret"),
                m("textarea#secret.form-input", { placeholder: "Your Secret", rows: 8, onchange: this.keys, value: this.keys() }),
                m("button.btn.btn-primary.float-right", { onclick: this.saveConfiguration.bind(this) }, "Save identity & remote"),
                m("p", "Saving identity and remote will cause a full page refresh.")

            ])
        ]

    }


}

module.exports = IdentityAndConnection