# advanced-ahoy template

This extends on the simple setup adding:
- icons
- signing + notiarizing config
- a patch for Windows setup
- automated publishing of releases to Github
    - _make sure you pushed the associated git tag to GH first_

## Setup

To run this in development mode, clone this repo down, then :

```bash
$ cd ssb-ahoy/templates/advanced
$ npm i
$ npm run start
```

To build an installer/ executable :

```
$ npm run release
```
_Produces an installer of ~81MB (for AppImage)_

## How this setup works

Differnt parts of the app are "built":
- `npm run build:main` bundles the `main.js` electron process up into `main.bundle.js`
    - this makes for faster startup _(electron doesn't have to read thousands of files)_
    - AND it grabs only the files required _(a light tree-shake)_
    - noderify reads config in `.noderifyrc`
- `npm run build:ui` bundles the UI up into a bundled version (this is mocked here)

Then we build the installer, following `builder/config.js` instructions
- grab the files needed
    - `main.bundle.js`
    - the bundled `ui` (just the whole folder)
    - some _native dependencies_ which have prebuilt binaries (`sodium-native`, `leveldown` stuff)
    - an `ssb-ahoy` script used for adding a simple API to the electron window
- use the icons for platform we're building

We then do some platform specific modifications:
- **Mac**
    - signing: see `electron-builder.env` where certificate secrets are stored
    - notarizing: see the `afterSign` notarize script and lines marked `// N`
        - this is super slow annoying step when you have to send a copy of the whole installer to Apple for signing.
- **Windows**
    - patching a missing dll: see `builder/config.js`, `win.nsis.include: 'builder/win/add-missing-dll.nsh'`
    - signing: see `electron-builder.env` where certificate secrets might be stored _(depends on cert type)_
- **Linux** (nothing)

Finally we auto-publish the new release to Github
- see `bulder/config.js`, `publish`
- see `electron-builder.env` where Github Tokens can be stored


## Bonus

If your UI bundling is fancy, it might care what targets it's bundling for.
Because we're using an _exact_ electron version, we can pin this in our package.json
`browerserslist` and get smaller, modern-only bundles.

## :fire: WARNING

This setup uses `electron-builder.env` file to store
- code signing secrets
- github tokens for publishing

**THIS FILE SHOULD NEVER BE COMMITTED** (add it to your `.gitignore`)
You can include an `electron-builder.env.template` with junk secrets to show other devs what
their local copy could look like
