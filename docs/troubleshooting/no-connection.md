# Can't connect to _sbot_

_sbot_ also known as _ssb-server_ is the server that does all the peer to peer networking in Secure Scuttlebutt. Even though we call it a server, it is just a program running on your machine. This part of Secure Scuttlebutt is usually not visible to the user. Applications just load this server up when they start.

When you run Patchfox for the first time, it displays a setup dialog that lets you select what identity to use, fill in your remote configuration, and tell Patchfox if you want it to start the server part or if you're going to run your own.

The default values are:

- Load the default identity stored in `~.ssb/secret`.
- Run the built-in server.

These values should get you the best Patchfox experience. Running it with different values require more knowledge about SSB such as how to run a server and which remote you're going to use.

## Things to double check

* Did you filled the correct keys and remote in the first-run setup process?
* Are you running _sbot_? Do you have another client running? If you have another client running at the same time, you might need to setup Patchfox so that it doesn't start its own server. Unless you really know what you're doing, you can't have two running SSB servers at the same time. So no running Patchwork and Patchfox at the same time unless you tell Patchfox not to start its server.
* Does the identity you used in Patchfox setup matches the identity on the running _sbot_?

<script src="help.js">

