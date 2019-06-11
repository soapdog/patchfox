# Troubleshooting
These are the most common problems you might encounter when using Patchfox. If whatever you're facing is not cover here, please [fill an issue on our Github repository](https://github.com/soapdog/patchfox/issues).

## No Configuration

To use Patchfox, you need to configure it with your Secure Scuttlebutt secret and remote. The easiest way to do it is by <a href="#" id="options-trigger">going to the Add-on options page for Patchfox</a>, there you can use the button labeled <i>Select Secret</i> to browse for your `.ssb/secret` file. Your remote and keys will be acquired from that file.

## Can't connect to _sbot_

_sbot_ also known as _ssb-server_ is the server that does all the peer to peer networking in Secure Scuttlebutt. Even though we call it a server, it is just a program running on your machine. Other Secure Scuttlebutt application such as [Patchwork](https://github.com/ssbc/patchwork) or [Patchbay](https://github.com/ssbc/patchbay) start their own embedded server when they launch (unless instructed otherwise). Unfortunately, browser add-ons cannot bundle [ssb-server](https://www.npmjs.com/package/ssb-server) for it would be a security risk if all add-ons started bundling their own server. 

Because of that, Patchfox is a _bring your own sbot_ client. You must start _sbot_ on your own. You can do it from the command line if you have the [ssb-server NPM package installed](https://www.npmjs.com/package/ssb-server) or by starting [Patchwork](https://github.com/ssbc/patchwork) or [Patchbay](https://github.com/ssbc/patchbay).

In the near future we'll refactor [Scuttle Shell](https://github.com/ssbc/scuttle-shell) to work with Patchfox again.

<script src="help.js">
