# Building Patchfox

## Requirements

* [Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/) or [Firefox Nightly](https://www.mozilla.org/en-US/firefox/nightly/) (needed so that you can sideload unsigned add-ons)
* [Scuttle Shell](https://github.com/ssbc/scuttle-shell). This is a soft requirement. You can use your own _sbot_ or use another client such as [Patchwork](http://github.com/ssbc/patchwork) or [Patchbay](http://github.com/ssbc/patchbay) to provide a running _sbot_.


## Setup & building

Patchfox uses [Svelte](https://svelte.dev/) and requires [NodeJS](https://nodejs.org) for development.

After you have NodeJS installed, you can navigate to the Patchfox directory and install dependencies with:

```
$ npm install
```

Now you can build Patchfox with:

```
$ npm run clean-build
```

Or you can create a development build:

```
$ npm run clean-dev
```

This command builds Patchfox using sourcemaps. This makes debugging easier, but increases Patchfox's disk space usage. Submissions to AMO and other browser add-on repositories should be built with the `clean-build` command in order to reduce the download size for end users.

## Running

Go to [about:debugging](about:debugging) in Firefox, select "This Firefox" and click to add a temporary add-on. Select the `manifest.json` file from the `dist/` folder in this repository.

## Setup inside Patchfox

Once Patchfox is running, it needs your _remote_ and _secret_. You can click the "browse" button on the setup screen and select your SSB secret file, usually located at `~/.ssb/secret`. Patchfox will use the data inside your secret file to derive your remote address. Remember to click save. 

> **macOS Users:** By default, your Mac will not display _hidden files_. Every file or folder that starts with a period is considered _hidden_. This means that the `.ssb/` folder in your home folder might not be visible to you. You can alter that by going to the Finder settings menu, or by pressing `Command + Shift + .`. 
>
> The macOS _file selection dialog_ also allows you to visit any folder with the `Command + Shift + G` keyboard shortcut. You'll see a text field where you can type `~/.ssb` and it will take you directly to the correct folder.

After saving, Patchfox will attempt to load your public feed. You need to have a running _sbot_ for it to work.

## Other NPM scripts

Patchfox contains many granular NPM scripts. I originally created Patchfox on a small Microsoft Surface Go with a Pentium CPU, so breaking the scripts into small, discrete actions made development faster.

As Patchfox is an extensions rather than a regular web app, there is no _watch & rebuild_ script.

### Cleaning scripts
These scripts are used to delete files and folders. You normally don't need to run these.

* **clean** deletes the `dist/` folder.
* **really-clean** deletes `node_modules/` - used when debugging Windows on ARM vs Windows on x86 emulation on the same machine. You can ignore it.

### Copying scripts
A large part of the build process is copying files around. An example is the script that copies the documentation you're reading into `dist/docs`. During day-to-day development, you rarely need to run these. The most common use-case is when changing the documentation, which happens for each release.

* **copy:manifest** copies `manifest.json` to `dist/`. This is the control file used by the browser that contains the metadata and configuration for the add-on.
* **copy:static** copies the static resources.
* **copy:augmented-ui** copies the cute cyberpunk-inspired CSS library that Patchfox uses.
* **copy:tribute-css** copies the CSS from [Tribute](https://www.npmjs.com/package/tributejs).
* **copy:spectre-icons-css** copies the Spectre icons CSS.
* **copy:browser-polyfill** copies the [browser polyfill](https://github.com/mozilla/webextension-polyfill).
* **copy:docs-folders** copies the documentation.
* **copy:docs-root** copies the root folder of the documentation (don't forget to run this!).
* **copy:index** copies `index.html`
* **copy:package-assets** is a tricky one. During development, the _assets_ used by packages are in a folder called `assets`, but in the build they need to be in a directory closer to the packages.
* **copy:package-docs** is similar to the previous script. During development, each package's documentation lives in a folder inside it. In the build process, these docs need to be moved to `dist/docs`.
* **copy:browserAction** copies `browserAction.html`. This is the menu you see when you click the Patchfox icon on your browser's toolbar.

### Build scripts
These scripts deal with all the transpiling and JS juggling used by our crazy ecosystem to turn the fantasy Javascript and Svelte code into something that the browser actually understands.

* **build:browserAction** builds the [_browser action_](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_action) JS used by the menu you see on the browser toolbar.
* **build:background** builds the [background script](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background) for the add-on.
* **build:addon** builds the main bundle, including packages.
* **build:platform-ssb** builds the _SSB core_.

### Development build scripts
These are the same as the previous build scripts but include sourcemaps. We can't use them to ship the add-on because the sourcemaps take up a lot of disk space that end users don't need.

* **dev:browserAction**
* **dev:background**
* **dev:addon**
* **dev:platform-ssb**

### Convenience scripts
These are useful convenience scripts that combine multiple scripts from above. Once you're familiar with the ones above, these scripts can be a more convenient alternative.

* **dev:both** runs dev:platform-ssb and dev:addon
* **build** runs all scripts from the `copy` and `build` categories
* **dev** runs all scripts from the `copy` and `dev` categories
* **clean-build** runs `clean` and then the above `build` convenience script
* **clean-dev** runs `clean` and then the above `dev` convenience script
* **nuke** runs `really-clean`, `clean`, and the `dev` convenience script

# Testing the protocol schemas

After installing and configuring patchfox, try visiting:

[ssb://message/sha256/Acm4sCjCDGWADCw773gfQyQ03tVYmxQLhyUWET8wLPc%3D](ssb://message/sha256/Acm4sCjCDGWADCw773gfQyQ03tVYmxQLhyUWET8wLPc%3D)

# General information

If you're interested in learning more about the technologies behind this add-on, check out:

* [MDN Web Docs - WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/).
* [Native Messaging API](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Native_messaging)
* [Native Messaging setup](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Native_messaging#Setup)
* [Secure Scuttlebutt Protocol Guide](https://ssbc.github.io/scuttlebutt-protocol-guide/)
