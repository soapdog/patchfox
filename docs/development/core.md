# Patchfox Core

The _core_ contains the low-level code that supports the [Patchfox packaging system](/development/packages.md). The source lives in `ui/core`. The best way to understand it is to learn about how the folders are organized.

## `ui/core/components`

This mess is the collection of reusable [Mithril](https://mithril.js.org) components that make up the UI for the packages.

Some of current reusable components are:

* **AvatarChip**: This is a small pill-like element with a picture and name. For an example of its usage, look at the list of followers on someone's profile. Those are all `m(AvatarChip, {feed: someFeed})`. This component is reused by many different components and packages.
* **AvatarMenuItem**: A small avatar display used by the _votes counter_ to display who liked a message.
* **AvatarRound**: Yet another way to display a feed. This is used in the corner of a message display to place a cute picture of the author.
* **GenericMsg**: This is the component used to generically render a message of an unknown type.
* **MessageDropdown**: This is a "kebab" or "three-dots" menu, used by all messages to provide a list of options.
* **MessageRaw**: This component renders a message in plain text. The above Dropdown component provides an option to view this component.
* **MessageRenderer**: This is the jack-of-all-trades message rendering component that will select the correct _card view_ for the given _message type_. These _card views_ come from the packages inside `ui/packages/`.
* **QueryRepeater**: Lots of views are just a collection of messages obtained with an _SSB query_. This is a handy component to render them.
* **VoteCounter**: The component to show _likes_ on a message.
* **Timestamp**: Just a convenient way to render timestamps.

## `ui/core/kernel`

Patchfox has a kernel that provides the `patchfox.*` API used by the packages. This should eventually get its own documentation page.

The kernel is responsible for the routines for preference handling, navigation, menu and event handling, and package loading.

You need to be doing something very deep to find yourself in this folder. Most code here has not seen any changes in years.

## `ui/core/platforms/nodejs-db1`

It's been a longtime dream of mine to support other protocols beyond SSB. To make that more feasible, I created a _platforms_ folder and placed the _ssb core_ inside it.

The _ssb core_ provides the `ssb.*` APIs to Patchfox. There is a lot of work to do there because it's messy, has a lot of dead code, and a ton of duplication.

This folder will also enable Patchfox to support different SSB backends such as _go ssb_ and the new _db2_. This is also where IPFS and Hyper code will live once I bring them back in.

## `ui/core/runtimes`

At the moment this is just a placeholder waiting for when I add _Lua_ and _Scheme_ to Patchfox again.
