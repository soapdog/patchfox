# Share on Scuttlebutt WebExtension 

This is an **ALPHA** quality WebExtension for Firefox to add a sidebar that enables the user to post to the [scuttlebutt](https://www.scuttlebutt.nz/) platform.

# Dependencies

This add-on depends on a _native app_ that needs to be correctly setup for it to work. It works by using the [Native Messaging API](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Native_messaging) to communicate with a bundled _sbot_.

Go to [sbot native app](https://github.com/soapdog/sbot_native_app) first and setup that app to be able to use this add-on.

# How to install the add-on

On [Firefox Nightly (or Firefox Dev Edition)](https://www.mozilla.org/firefox/channel/desktop/) go to _about:debugging_ and use the _load temporary add-on_ button to browse your files. Select the _manifest.json_ file included with this repository. The sidebar should launch with a text area that allows you to post to scuttlebutt.

To learn more about WebExtension development and debugging, go to [MDN Web Docs - WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/).

# Roadmap

* [] - Add error checking for missing native sbot app.
* [] - Add support for private messages.
* [] - Add helper for mentioning friends.

# Contributing

This is free software under the terms of the MIT license. I would love contributions to this WebExtension. I tried to make it as vanilla as possible to the point that it is quite naive. My objective is to make it approachable for new contributors with minimal knowledge of JS.

The WebExtension is running on a different and isolated DOM than the page being displayed so we don't need to worry about many stuff that is common to Web Development.

If you want to contribute, these are some ideas:

* Need a better icon.
* Need translations.
* Need private messaging.

# Sponsorships

Do you want a decentralized internet too? Are you worried about the loss of net neutrality and realized that radical decentralization is the way to fight back? Have some cryptobucks to spare? If you want to make a financial contribution to help me fund development of this and other dex focused software, I would love to receive contributions in the following cryptocurrencies:

* Ethereum: 0x0bd1bbb25cc9dd2ce8ea1fba4e333ff091f671a9
* Bitcoin: 1Px1PeVBJ2Mz1iC6UF8UZVXW7zPoonMVKJ
* DASH: Xh5b2TfS7CTUgSMUENWUQFmTqZyk3DUdQX

