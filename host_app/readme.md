
## Native companion app
This repository also contains a native companion app that is able to supply features for Firefox WebExtensions posting to the [scuttlebutt](https://www.scuttlebutt.nz/) platform.

This is needed because there are no WebExtension APIs for TCP and UDP so we can't implement the correct protocols for scuttlebutt. Instead we have a way to use the [Native Messaging API](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Native_messaging) to establish communication between a native application (this app) and an authorized WebExtension. Through this communication channel, an add-on can call on features provided by this native app. We can think of it much like we do with back-end and front-end web programming, this app is the back-end providing features and all the authorized add-ons are front-end interfacing with Firefox users.

**Be aware that the companion app is not a requirement, Patchfox can use WebSockets to communicate with a running _sbot_.** So you can run Patchfox in parallel with other clients that start their own _sbot_ or even start it from the command-line with `sbot serve`. Still, this companion app makes it effortless to use Patchfox.

### Dependencies

This native application is [NodeJS](https://nodejs.org) based and you need to have a recent version of it installed.

#### How to setup the native app

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

#### Verifying your configuration

Run the verification script as:

```
$ npm run check-win
```

or

```
$ npm run check
```

Depending if you're running Windows 10 or other operating system.

# How to install the add-on

On [Firefox Nightly (or Firefox Dev Edition)](https://www.mozilla.org/firefox/channel/desktop/) go to _about:debugging_ and use the _load temporary add-on_ button to browse your files. Select the _manifest.json_ file included with this repository in the `webextension/build` folder. 

To learn more about WebExtension development and debugging, go to [MDN Web Docs - WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/).

## Commentary, getting help

Actually, I kinda think the whole process for native app communication is quite bad from a developer ergonomics perspective and I have no idea why Google implemented it like that in the first place but it set a precedent and now Firefox is doing it similarly. I am trying to supply some _configuration verification scripts_ but in case everything fails, read the documentation about WebExtensions and native messaging to get back on track:

* [MDN Web Docs - WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/).
* [Native Messaging API](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Native_messaging)
* [Native Messaging setup](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Native_messaging#Setup)