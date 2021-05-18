# Patchfox :id=readme
This is a new client for [Secure Scuttlebutt](http://scuttlebutt.nz) packaged as a Web Extension for Firefox. It is available on the [Firefox Add-ons Portal](https://addons.mozilla.org/en-US/firefox/addon/patchfox/), so if you just want to run it, that's the easiest way. Read on if you want to develop with it.

## Requirements

* [Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/) or [Firefox Nightly](https://www.mozilla.org/en-US/firefox/nightly/) (needed so that you can sideload unsigned add-ons)
* [Scuttle Shell](https://github.com/ssbc/scuttle-shell). This is a soft requirement. You can use your own _sbot_ or even have another client such as [Patchwork](http://github.com/ssbc/patchwork) or [Patchbay](http://github.com/ssbc/patchbay) running and providing a running _sbot_. 


## Setup & Building

Patchfox uses [Svelte](https://svelte.technology) and requires [NodeJS](https://nodejs.org) for development. After you have NodeJS installed, you can install the dependencies with:

```
$ npm install
```

And build the add-on with:

```
$ npm run clean-build
```

If you want to develop with a watcher that rebuilds the add-on when file changes use:

```
$ npm run clean-dev
```

## Running

Go to [about:debugging](about:debugging) on Firefox, select `this firefox` and click to add a temporary add-on. Select the `manifest.json` file from the `dist/` folder from this repository.

## Setup inside Patchfox

Once patchfox is running, it needs to learn your _remote_ and _secret_, you can just click the "browse" button on the setup screen and select your `.ssb/secret` file. Patchfox will use the data inside your secret file to derive your remote address. Remember to click save. 

After saving Patchfox will then try loading your public feed. You need to have a running _sbot_ for it to work.

# Testing the protocol schemas

After installing and configuring patchfox, try browsing to:

[ssb://message/sha256/Acm4sCjCDGWADCw773gfQyQ03tVYmxQLhyUWET8wLPc%3D](ssb://message/sha256/Acm4sCjCDGWADCw773gfQyQ03tVYmxQLhyUWET8wLPc%3D)

# Commentary, getting help

I'f you're interested in learning more about the technologies behind this add-on, check out:

* [MDN Web Docs - WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/).
* [Native Messaging API](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Native_messaging)
* [Native Messaging setup](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Native_messaging#Setup)
* [Secure Scuttlebutt Protocol Guide](https://ssbc.github.io/scuttlebutt-protocol-guide/)

Don't hesitate to reach out to me at:

* Scuttlebutt: `@gaQw6z30GpfsW9k8V5ED4pHrg8zmrqku24zTSAINhRg=.ed25519`
* Mastodon: [@soapdog@toot.cafe](https://toot.cafe/@soapdog)
* Twitter: [@soapdog](http://twitter.com/soapdog/)

# Sponsorship

Do you want a decentralized internet too? Are you worried about the loss of net neutrality and realized that radical decentralization is the way to fight back? If you want to make a financial contribution to help me fund development of this and other dex focused software, I would love to receive contributions through these channels:

* [Patchfox Open Collective](https://opencollective.com/patchfox)

# Artwork attribution

Patchfox is using artwork by many artists including:

* Art made by Angelica. 

* Some icons made by <a href="https://www.flaticon.com/authors/eucalyp" title="Eucalyp">Eucalyp</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>.

# Original SSBC-GRANTS proposal

The original proposal is at: %vanIz/czvKhgXi3Psmo/BEr5TN7pAUg4ucrR1fo8uZ8=.sha256
