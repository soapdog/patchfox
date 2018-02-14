# PATCHFOX - A Secure Scuttlebutt client for Firefox as a WebExtension

This is an **ALPHA** quality WebExtension that contains a native companion app to supply features for Firefox WebExtensions posting to the [scuttlebutt](https://www.scuttlebutt.nz/) platform.

This is needed because there are no WebExtension APIs for TCP and UDP so we can't implement the correct protocols for scuttlebutt. Instead we have a way to use the [Native Messaging API](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Native_messaging) to establish communication between a native application (this app) and an authorized WebExtension. Through this communication channel, an add-on can call on features provided by this native app. We can think of it much like we do with back-end and front-end web programming, this app is the back-end providing features and all the authorized add-ons are front-end interfacing with Firefox users.

# Dependencies

This native application is [NodeJS](https://nodejs.org) based and you need to have a recent version of it installed.

## How to setup the native app

You need to install the dependencies first:

```
$ npm install
```

After that the procedure changes depending on which OS you're running as the configuration of _native apps_ differs by operating system with Windows being a quite convoluted process. To setup the application, meaning place the correct _app manifest_ json in the correct place and fix the paths, run:

```
$ npm run setup-win
```

or 

```
$ npm run setup
```

Depending if you're running Windows 10 or other operating system. Also, if you are running under a unix-like system, you will need to double check the shebang invocation on top of the `index.js` file to make sure that it points to your NodeJS location. I tried using `env` there but it didn't work when started from inside Firefox, so it is hardcoded to the default location of NodeJS installation.

Be aware that the setup procedure will place hardcoded paths in files critical for running this app. **If you move this application to a different folder or rename any folder in its path, you'll need to run this setup again.**

# How to install the add-on

On [Firefox Nightly (or Firefox Dev Edition)](https://www.mozilla.org/firefox/channel/desktop/) go to _about:debugging_ and use the _load temporary add-on_ button to browse your files. Select the _manifest.json_ file included with this repository. The sidebar should launch with a little help and the public timeline should open on a new tab.

To learn more about WebExtension development and debugging, go to [MDN Web Docs - WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/).

## Commentary, getting help

Actually, I kinda think the whole process is quite bad from a developer ergonomics perspective and I have no idea why Google implemented it like that in the first place but it set a precedent and now Firefox is doing it similarly. I am trying to supply some _configuration verification scripts_ but in case everything fails, read the documentation about WebExtensions and native messaging to get back on track:

* [MDN Web Docs - WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/).
* [Native Messaging API](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Native_messaging)
* [Native Messaging setup](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Native_messaging#Setup)

Don't hesitate to reach out to me at:

* Scuttlebutt: @gaQw6z30GpfsW9k8V5ED4pHrg8zmrqku24zTSAINhRg=.ed25519
* Mastodon: @soapdog@toot.cafe
* Twitter: @soapdog

## Verifying your configuration on Windows 10

Run the verification script as:

```
$ npm run check-win
```

or

```
$ npm run check
```

Depending if you're running Windows 10 or other operating system.

# Contributing

This is free software under the terms of the MIT license. I would love contributions to this WebExtension. I tried to make it as vanilla as possible to the point that it is quite naive. My objective is to make it approachable for new contributors with minimal knowledge of JS.

The WebExtension is running on a different and isolated DOM than the page being displayed so we don't need to worry about many stuff that is common to Web Development.

If you want to contribute, these are some ideas:

* Need to expose more API calls.
* Need a shim to make WebExtension developer life easier so they don't keep programming in such low-level API like `ports`.
* Need robust setup code and instructions.

# Sponsorship

Do you want a decentralized internet too? Are you worried about the loss of net neutrality and realized that radical decentralization is the way to fight back? Have some cryptobucks to spare? If you want to make a financial contribution to help me fund development of this and other dex focused software, I would love to receive contributions in the following cryptocurrencies:

* Ethereum: 0x0bd1bbb25cc9dd2ce8ea1fba4e333ff091f671a9
* Bitcoin: 1Px1PeVBJ2Mz1iC6UF8UZVXW7zPoonMVKJ
* DASH: Xh5b2TfS7CTUgSMUENWUQFmTqZyk3DUdQX

