# Building Patchfox

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

If you use:

```
$ npm run clean-dev
```

It will build the add-on using sourcemaps which makes debugging easier but can't be submit to AMO because they limit bundles to 4mb.

## Running

Go to [about:debugging](about:debugging) on Firefox, select `this firefox` and click to add a temporary add-on. Select the `manifest.json` file from the `dist/` folder from this repository.

## Setup inside Patchfox

Once patchfox is running, it needs to learn your _remote_ and _secret_, you can just click the "browse" button on the setup screen and select your `.ssb/secret` file. Patchfox will use the data inside your secret file to derive your remote address. Remember to click save. 

> **macOS Users:** In the default configuration, your mac will not display _hidden files_. Every file or folder that starts with a period is considered _hidden_. This means that the folder `.ssb/` in your home folder might not be visible to you. You can alter that going to the Finder. 
>
> Another important feature to learn, one that you will use beyond SSB and Patchfox, is that in any _file selection dialog_ you can press CMD+SHIFT+G to see a _Go to Folder_ input. You can type `~/.ssb` in it and it will open the correct folder for you.

After saving Patchfox will then try loading your public feed. You need to have a running _sbot_ for it to work.

## Other NPM tasks

I went overboard with NPM tasks. I created discreet tasks for everything that I could want to do. That was because I was working on a small Microsoft Surface Go with a Pentium-class CPU and breaking down the tasks into discreet NPM tasks made my development faster.

There is no task to _watch & rebuild_ the add-on, this is not web development. 

The tasks are

### Cleaning Tasks
These tasks are used to delete stuff. You normally don't need to run these tasks.

* **clean:** deletes the `dist/` folder.
* **really-clean:** deletes `node_modules/`. Used it when debugging Windows on ARM vs Windows on x86 emulation on the same machine. You can ignore it.

### Copying Tasks
A large part of the building process is copying files around. An example is the task that copies this documentation you're reading into `dist/docs`. During day to day development, you don't normally need to run these tasks. The most common need is when changing the documentation, which happens for every release.

* **copy:manifest** copies the `manifest.json` to `dist/`. This is the control file used by the browser that contains the metadata and configuration for the add-on.
* **copy:static** copies the static resources.
* **copy:augmented-ui** Patchfox uses some cute cyberpunk inspired CSS library, it needs to be copied around manually.
* **copy:tribute-css** Another CSS that needs to be copied manually.
* **copy:spectre-icons-css** Another CSS that needs copying.
* **copy:browser-polyfill** Copies the [browser polyfill](https://github.com/mozilla/webextension-polyfill).
* **copy:docs-folders** Copies the documentation.
* **copy:docs-root** Don't forget copying the root folder of the documentation.
* **copy:index** Copy `index.html`
* **copy:package-assets** This is a tricky one, during the development the _assets_ used by the Packages are in a folder called assets, but in the build they need to be near the packages.
* **copy:package-docs** Same as before, during the development, each package's documentation live in a folder inside it. When built these docs needs to be moved to `dist/docs`.
* **copy:browserAction** Copies the _browser action_ HTML file, this is the menu you see on the browser toolbar.

### Building Tasks
These tasks deal with all the transpiling and JS juggling used by our crazy ecosystem to make the fantasy Javascript I write and the Svelte, become something that the browser actually understands.

* **build:browserAction** builds the [_browser action_](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_action) JS used by the menu you see on the browser toolbar.
* **build:background** builds the [background script](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background) for the add-on.
* **build:addon** builds the main bundle. This builds the packages.
* **build:platform-ssb** this builds the _SSB core_.

### Development Building Tasks
They are the same as the previous building tasks but they include building sourcemaps. It is what I use during development. We can't use them to ship the add-on because the sourcemaps are too large.

* **dev:browserAction**
* **dev:background**
* **dev:addon**
* **dev:platform-ssb**

### Convenience Tasks
These are useful convenience tasks that combine multiple tasks. Once you're familiar with the tasks, running the convenience methods is very convenient.

* **dev:both** runs dev:platform-ssb dev:addon
* **build** runs copy:* build:*
* **dev** runs copy:* dev:*
* **clean-build** runs clean build
* **clean-dev** runs clean dev
* **nuke** runs really-clean clean dev

# Testing the protocol schemas

After installing and configuring patchfox, try browsing to:

[ssb://message/sha256/Acm4sCjCDGWADCw773gfQyQ03tVYmxQLhyUWET8wLPc%3D](ssb://message/sha256/Acm4sCjCDGWADCw773gfQyQ03tVYmxQLhyUWET8wLPc%3D)

# Commentary, getting help

I'f you're interested in learning more about the technologies behind this add-on, check out:

* [MDN Web Docs - WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/).
* [Native Messaging API](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Native_messaging)
* [Native Messaging setup](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Native_messaging#Setup)
* [Secure Scuttlebutt Protocol Guide](https://ssbc.github.io/scuttlebutt-protocol-guide/)
