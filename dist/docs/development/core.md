# Patchfox Core

The _core_ contains the low-level code that is used to support the [Patchfox packaging system](/development/packages.md). The source lives in `src/core`. The best way to understand it is to learn about the folder organisation.

## `src/core/background`

This folder contains the source that builds the [background script](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background) used by the add-on.

It is the responsibility of the background to initialize and manage the following features:

* Contextual menus: When you open the context menu on a web page, you'll see a new Patchfox item allowing you to copy quotations with link, or just the link.
* Omnibox searching: The browser address bar is called the omnibox, it provides many more features than just typing an address or searching. When Patchfox is installed, you can use `ssb?` as a prefix to search SSB instead of your search engine.
* Update checking: Automatically opening the _release notes_ when there is a version upgrade.

## `src/core/browserAction`

This folder contains the source that builds the [_browser action_](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_action) used by the add-on. This is the button added to the browser's toolbar with the Patchfox logo.

It allows you to quickly launch the most common features of the add-on.

## `src/core/components`

Oh boy, it is getting trickier. This mess is the collection of reusable Svelte components that make up the UI for the packages. There is a `ui/` folder in there because I wanted to organise them better inside it but in the end they are kinda all _UI_ stuff and I should refactor that folder out.

The current reusable components are:

* AvatarChip: This is the small pill-like element with the feed picture and name used by many packages. If you want to see some of them, look into a profile list of followers for example. Those are all `<AvatarChip feed={someFeed}>`.
* AvatarMenuItem: A small avatar display used by the _votes counter_ to display who liked a message.
* AvatarRound: Yet another way to display a feed. This is used in the corner of a message display to place a cute picture of the author.
* GenericMsg: This is the component used to render an unknown message.
* MessageDropdown: This is the corner menu used by all messages, the one with three dots.
* MessageRaw: The Dropdown above gives the user the ability to see a raw message, this is the component used to render it.
* MessageRenderer: This is the jack-of-all-trades message rendering components that will select the correct _card view_ for the given _message type_. These _card views_ come from the packages inside `src/packages/`.
* QueryRepeater: Lots of views are just a collection of messages obtained with a _SSB query_. This is a handy component to render them.
* VoteCounter: The component to show _likes_ in a message.
* Timestamp: Just a convenient way to render timestamps.

## `src/kernel`

Oh booooy, now we're diving deep. Patchfox has a kernel which provides the `patchfox.*` API used by the packages. This needs it's own page for documentation.

The kernel is responsible for the routines for preference handling, navigation, menu and event handling, and package loading.

You need to be doing something very deep to find yourself in this folder. Most code here has not seen any change in two years.

## `src/platforms/ssb`

It is a long dream of mine to maybe support more protocols than SSB at some point. To make that more feasible, I created a _platforms_ folder and placed the _ssb core_ inside it.

The _ssb core_ provides the `ssb.*` APIs to Patchfox. There is a lot of work to do there because it is messy, has a ton of dead code, and a ton of duplication.

## `src/runtimes`

At the moment this is just a placeholder waiting for when I add _Lua_ and _Scheme_ to Patchfox again.
