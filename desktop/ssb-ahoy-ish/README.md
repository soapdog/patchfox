# Patchfox is vendoring ssb-ahoy

This decision was made because I need more control over the things that `ssb-ahoy` makes easier for me. Such as the windows.

The original readme is featured below.

# ssb-ahoy !

A module for building electron-based scuttlbutt apps.
You provide a UI and plugins, and `ssb-ahoy` takes care of boring details for you.

Built with `electron@18.0.1` and `secret-stack@6`

## Getting started 

```bash
$ npm i ssb-ahoy
```

Create a root file for your project:
```js
// index.js
const ahoy = require('ssb-ahoy')
const path = require('path')

ahoy(
  'http://localhost:8080', // an address (http/file) for UI
  {
    plugins: [
      require('ssb-db'),
      require('ssb-backlinks')
    ]
  },
  (err, ssb) => {
    if (err) throw err

    console.log('ahoy started', ssb.id)
  }
)
```

Add a script to your package.json:
```json
// package.json
{
  "main": "index.js",
  "scripts": {
    "start": "electron index.js"
  }
}
```

Run it:
```bash
$ npm start
```

## API

### `ahoy(url, opts, cb)`

- `url` *String* - a url to load the app UI from
  - can start with
      - `http:`, `https:` - great for local dev-servers
      - `file:` - useful when you bundle ui for production, electron fetches directly from file system
          - e.g. `file://${path.join(__dirname, 'dist/index.html)}'
  - required

- `opts` *Object* with properties:
    - `opts.title` *String* - the title of your app
        - will be the title of the app window
        - default: `'hello_world'`
    - `opts.plugins` *[Plugin]* - an array of `secret-stack` plugins
        - default: `[]`
    - `opts.config` *Object* - over-rides what's passed to `secret-stack` + `plugins` on launch
        - `opts.config.path` *String* - location your database + secret will be installed
            - default: `\${envPaths.data}/ssb-ahoy/dev/\${format(opts.title)}` 
        - generally defaults follow `ssb-config/defaults.js`

- `cb` *function* callback which is run once ssb and electron have started up


### `ahoy(url, opts) => Promise`

Convenience method which is a `promisify`'d version of the last method.

## `window.ahoy` (ui window api)

There's a method exposed in the UI window, that can be used like this:

```js
window.ahoy.getConfig()
  .then(config => {
    // could use this to connect to back end with e.g. ssb-client
    console.log(config)
  })
```


## Templates

This repo includes two working example templates.
Start simple and upgrade as your interest and time permits

- [Simple Template](./templates/simple/README.md)
- [Advanced Template](./templates/advanced/README.md)


## Building installers

Your project MUST have:
- a package.json with:
    - `main` pointing at the file which contains your ahoy setup (electron-builder uses this to build from)
    - `script` for building release
    ```json
    {
      "main": "main.js",
      "script": {
        "release": "electron-builder --config builder/config.js"
      }
    }
    ```
- an `electron-builder` config
    - the "release" script points at this
    - putting your config in a `js` file means you can annotate it (you should)
    - see `templates/builder/config.js` for the most minimal template


### Native dependencies

Scuttlebutt is built with _native dependencies_ - libraries for cryptography/ database work
that depend on lower level C libraries that need to be compiled for particular architectures
(i.e. are native).

`electron-builder` does a great job of making sure that the versions installed are compatible
with the electron environement we're running them in, but sometimes it trips up.

You can often address this by adding a script to your package.json like:
    ```json
    {
      "script": {
        "postinstall": "npm run fixDeps",
        "fixDeps": "electron-builder install-app-deps"
      }
    }
    ```

Most of the modules typically used have "prebuilds" which are just fetched from the internet.
If a prebuild doesn't exist you may have to build it yourself - read the errors, you'll likely
see `node-gyp` mentioned, which is a one common node tool for compiling dependencies.


## Resouces:

- `electron-builder` docs: www.electron.build
- Apple's painful signing process:
    - https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/
- Electron releases: https://www.electronjs.org/releases/stable#18.0.1


---

## Development

## Notes

- we pin `electron` to an exact version here for 2 reasons:
    - ensure it's tested + stable in this module
    - help `electron-builder` to know _exactly_ what it's building against

- adding `electron` and `electron-builder` to peerDependencies was done to try and make it as easy as possible to get started with `ssb-ahoy`. Things to take into acount if changing this:
    - build size: current example app makes an 83MB AppImage
        - if you set things up incorrectly, this will jump to 125MB+
    - not having to manually install lots of modules
    - `electron-builder` shouldn't need to be told what version of `electron` it's building for

- adding `dmg-license` to optionalDependencies was done to try and make it as easy as possible to get started for mac users
    - this module throws some error if you try and isntall it on linux
    - listing it here seems to stimulate installation of it on macs

- To inspect `app.asar` files:
    ```bash
    $ cd example/dist/installers/linux-unpacked/resources
    $ npx asar extract app.asar destfolder
    $ filelight destfolder
    ```
    _filelight is a linux tool for visually exploring folders_

