# simple-ahoy template

This is a totally minimal setup, designed to mke it really easy to get going.

## Setup

To run this in development mode, clone this repo down, then :

```bash
$ cd ssb-ahoy/templates/simple
$ npm i
$ npm run dev
```

To build an installer/ executable :
```
$ npm run release
```
_Produces an installer of ~88MB (for AppImage)_

## Caveats

This setup will get you going and get installers in your friends hands, but it will be pretty raw.

Things this template doesn't cover, that you could improve:
- no UI bundling
   - I've written a _very_ simple bundle-free ui to keep this template easy to read
   - if you're using a framework which outputs bundles you'll need to wire that up
       - just make sure your `main.js` is pointing at the bundled `index.html` file
       - consider having the UI src in `main.js` pivot on `process.env.NODE_ENV`
- no code signing
   - without this, peers using your installers will just get warnings they have to click past to install.
   - start simple, add this later _if_ you need it
- no custom icons
   - you'll get a default electron icon :shrug:
- non-dev windows peers might have trouble
   - there is a DLL they may be missing (Visual Studio something...)
   - see the advanced template for patching that
- no installer size optimisations
   - by default *all* your `node_modules` are gonna be packaged into an installer
   - see the advanced template for an example setup

