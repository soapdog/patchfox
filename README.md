# Patchfox
This is a new client for [Secure Scuttlebutt](http://scuttlebutt.nz) packaged as a Web Extension for Firefox.

## Requirements

* [Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/)
* [Scuttle Shell](https://github.com/ssbc/scuttle-shell)

## Setup

* Follow the Scuttle-Shell setup described in [the projects README](https://github.com/ssbc/scuttle-shell/blob/master/README.md). Be aware that Patchfox will work without Scuttle-Shell provided there is a _sbot_ running with the plugins it needs (the only non-common plugin it uses is [ssb-threads](https://github.com/ssbc/ssb-threads)). It is easier to use Scuttle-Shell though because the add-on can start and stop it leading to a more pleasant experience.

* Install dependencies with `$ npm install`

## Building

`
$ npm run dev
`

This will launch [Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/) running the WebExtension, you need to click on the little _hermie_ button on the toolbar to launch it.

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