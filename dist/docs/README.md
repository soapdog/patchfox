# Patchfox :id=readme
This is a new client for [Secure Scuttlebutt](http://scuttlebutt.nz) packaged as a Web Extension for Firefox.

## Requirements

* [Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/) or [Firefox Nightly](https://www.mozilla.org/en-US/firefox/nightly/)
* [Scuttle Shell](https://github.com/ssbc/scuttle-shell). This is a soft requirement. You can use your own _sbot_ or even have another client such as [Patchwork](http://github.com/ssbc/patchwork) or [Patchbay](http://github.com/ssbc/patchbay) running and providing a running _sbot_. 


## Setup & Building

Patchfox uses [Svelte](https://svelte.technology) and requires [NodeJS](https://nodejs.org) for development. After you have NodeJS installed, you can install the dependencies with:

```
$ npm install
```

And build the add-on with:

```
$ npm run build
```

If you want to develop with a watcher that rebuilds the add-on when file changes use:

```
$ npm run dev
```

## Running

Go to [about:debugging](about:debugging) on Firefox, select `this firefox` and click to add a temporary add-on. Select the `manifest.json` file from the `dist/` folder from this repository.

## Setup inside Patchfox

Once patchfox is running, it needs to learn your _remote_ and _secret_, you can just click the "browse" button on the setup screen and select your `.ssb/secret` file. Patchfox will use the data inside your secret file to derive your remote address. Remember to click save. 

After saving Patchfox will then verify the configuration, if you're not running scuttle-shell, it will ask you if you want to run it.

# Testing the protocol schemas

After installing and configuring patchfox, try browsing to:

[ssb:%Acm4sCjCDGWADCw773gfQyQ03tVYmxQLhyUWET8wLPc=.sha256](ssb:%Acm4sCjCDGWADCw773gfQyQ03tVYmxQLhyUWET8wLPc=.sha256)

# Commentary, getting help

I'f you're interested in learning more about the technologies behind this add-on, check out:

* [MDN Web Docs - WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/).
* [Native Messaging API](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Native_messaging)
* [Native Messaging setup](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Native_messaging#Setup)

Don't hesitate to reach out to me at:

* Scuttlebutt: `@gaQw6z30GpfsW9k8V5ED4pHrg8zmrqku24zTSAINhRg=.ed25519`
* Mastodon: [@soapdog@toot.cafe](https://toot.cafe/@soapdog)
* Twitter: [@soapdog](http://twitter.com/soapdog/)

# Sponsorship

Do you want a decentralized internet too? Are you worried about the loss of net neutrality and realized that radical decentralization is the way to fight back? Have some cryptobucks to spare? If you want to make a financial contribution to help me fund development of this and other dex focused software, I would love to receive contributions in the following cryptocurrencies:

* Ethereum: 0x0bd1bbb25cc9dd2ce8ea1fba4e333ff091f671a9
* Bitcoin: 1Px1PeVBJ2Mz1iC6UF8UZVXW7zPoonMVKJ
* DASH: Xh5b2TfS7CTUgSMUENWUQFmTqZyk3DUdQX
