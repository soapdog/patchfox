# Building Patchfox

## Requirements

* [NodeJS](https://nodejs.org)

## Setup & building

Patchfox uses [Mithril](https://mithril.js.org/) and requires [Node.js](https://nodejs.org) for development.

After you have Node installed, you can navigate to the Patchfox directory and install dependencies with:

```
$ npm install
```

Now you can build Patchfox with:

```
$ npm run build
```

## Running

Use:

```
$ npm start
```

To run Patchfox. 

## Setup inside Patchfox

Once patchfox is running, it needs to learn your _remote_ and _secret_, you can just click the "browse" button on the setup screen and select your `.ssb/secret` file. Patchfox will use the data inside your secret file to derive your remote address. Remember to click save. 

After saving Patchfox will then try loading your public feed. You need to have a running _sbot_ for it to work.

## Other NPM scripts

* `npm run css`: builds the CSS. Every time you add a new CSS rule that you haven't used before, you need to run this again. The CSS is built with [Tailwind CSS](tailwindcss.com/) and [Daisy UI](daisyui.com/).
* `npm run builder:*` many different scripts to build binaries for each platform.
* `npm run docs`: builds the documentation.
* `npm run localbuild`: builds the CSS, the docs, and binaries for various platforms on your local machine. 
* `npm run release`: Makes a new release and upload it to Github.

# Testing the protocol schemas

After installing and configuring Patchfox, try visiting:

[ssb://message/sha256/Acm4sCjCDGWADCw773gfQyQ03tVYmxQLhyUWET8wLPc%3D](ssb://message/sha256/Acm4sCjCDGWADCw773gfQyQ03tVYmxQLhyUWET8wLPc%3D)

# General information

If you're interested in learning more about the technologies behind Patchfox, check out:

* [Secure Scuttlebutt Protocol Guide](https://ssbc.github.io/scuttlebutt-protocol-guide/)
