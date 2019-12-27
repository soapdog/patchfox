const m = require("mithril")

class About {
    view() {
        let currentVersion = browser.runtime.getManifest().version


        const blurb = `
<h1>About Patchfox</h1>
<p>Current Patchfox Version is <i>${currentVersion}</i></p>
<p>Source code is available at:</p>
<ul>
    <li><a href="https://github.com/soapdog/patchfox">Github</a></li>
    <li><a href="https://git.sr.ht/~soapdog/patchfox">Sourcehut</a></li>
</ul>
`
        return m.trust(blurb)
    }
}

module.exports = About