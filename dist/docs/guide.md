# Getting Started

## What is Secure Scuttlebutt

Secure Scuttlebutt is an offline-first decentralized peer-to-peer network in which people can share data with each other and their friends forming a social graph similar to how friendship and gossip work in the physical world. Even though this is a correct way of explaining it, it doesn't really help you understand what it is, does it? The best explanation is the video found on the main page of [https://scuttlebutt.nz](https://scuttlebutt.nz) which is linked below:

<iframe src="https://player.vimeo.com/video/236358264" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
<p><a href="https://vimeo.com/236358264">A Scuttlebutt Love Story</a> from <a href="https://vimeo.com/user70865009">zach</a> on <a href="https://vimeo.com">Vimeo</a>.</p>

## How does Patchfox fit into it

There are many applications you can use to access Secure Scuttlebutt (we call them clients). You may be familiar with the two most popular ones [Patchwork](https://github.com/ssbc/patchwork) and [Patchbay](https://github.com/ssbc/patchbay). There are many other clients available besides these two. Patchfox is another client, one that **lives inside your web browser and helps bridge the web browsing experience with the scuttlebutting experience so that both the web and the dweb appear as one**.

Since the implementation of Secure Scuttlebutt requires some technical features which are not available to browser add-ons -- such as sockets, filesystem access -- we can't ship the full _sbot_ server (also known as `ssb-server`) with Patchfox like the other desktop clients do. So, to use the add-on you need to be _running your own sbot_. It doesn't matter if your running _sbot_ from the embedded copies inside Patchwork or Patchbay or if you're starting it from the command line from the [ssb-server NPM package](https://www.npmjs.com/package/ssb-server), the important thing is that there is a server running when you start Patchfox.

Most clients have a way for the user to run without starting embedded copies of _sbot_, this makes it possible to have only one _sbot_ running and multiple clients connecting to it.

You might want to checkout [our semi-official page about Secure Scuttlebutt](https://scuttlebutt.nz), there is a getting started guide there that will help you get your _sbot_ running.

## How to configure it


Once patchfox is running, it needs to learn your _remote_ and _secret_, you can just click the "browse" button on the setup screen and select your `.ssb/secret` file. Patchfox will use the data inside your `secret` file to derive your remote address. Remember to click save. 

After saving Patchfox will then verify the configuration, if you're not running scuttle-shell, it will ask you if you want to run it. You can open the <a href="#" id="options-trigger">settings screen by clicking here</a>.


<script src="/docs/help.js">
