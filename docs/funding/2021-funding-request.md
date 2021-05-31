# Patchfox: New funding proposal

> **TL;DR:** Compared to some years ago, there are fewer SSB clients seeing active development these days. I believe these clients could use some more funding. Having the safety of a grant would make development more sustainable and enable the teams behind those projects to devote more time to them.

I have been pushing Patchfox forward with a faster release cycle during the last weeks. This was motivated by reading about the sunsetting of Patchwork, and deciding that this means the other clients need to step up.

Patchfox has been in development since late 2018, and there have been 16 releases so far, which IMHO is not a bad track record for a team of one. There is a lot to 🥰 in Patchfox, but some highlights that make me proud are:

* It championed _content warnings_ on SSB.
* It has unique moderation features that allow very fine-grained control over what the user sees.
* It strives to integrate with the web experience when it makes sense, such as providing iCal exports for gatherings, and RSS/Atom import for blog posts.
* It has bundled documentation for users, developers, and common troubleshooting.

There are few pieces missing — and some that need improvement — before Patchfox can become a viable main client. This funding proposal is to enable that development.

### Why I need funding

I am a freelance developer and writer. My freelance situation is odd, as I'm not really freelancing, I've worked for the same employer for the past 16 years. I really like them, but that job is what it is. There is no opportunity for career advancement there, it is just me and the monks who work with me. People here on SSB know that I want to be a full-time writer, so I'm not pursuing freelance gigs. I don't want new programming projects for clients, working on software I don't really care about. I do care about SSB and want to work more on Patchfox.

At my job, I get paid by the hour. My hours are diminishing after my boss situation changed and he had to cut the amount of time he spends working. Once my Grant For The Web is over — which will happen in 15 days — I'll see a huge drop in my "combined salary". This means that I will need to scramble to make some more cash, which usually means that I will go full-time writing a programming book really fast. This also means that I might not have enough time available to devote to Patchfox as I'll need to focus on making money.

So the funding is in essence, to enable me to devote the hours I need to work on this client without the pressure from being a freelancer on a downward curve.


### What funding will enable

I'm not asking for funding for the purpose of simply continuing development as it is. I have big plans, the kind that will require a lot of work and time devoted to it.

As expressed in the recent posts, Patchfox codebase is now considered stable and won't go through a new rewrite. I have the intention of [starting a bounty program](%kLZg/dRVzvAuPDBXvEGzplYva5cWMcfbUQ/dB0bjfbc=.sha256) and already begun [accepting contributions from other developers](%hYLSp/zPkvUj2f3DMk9vzUafKy9SVruDjuWFmj7vu60=.sha256) (thanks Tim for the fixes). The latest version shipped with the [initial developer-focused documentation](%BL6GXI3k15M3mAWoBFe1bFsN00083Qz2pmI2s+IPMl0=.sha256). These steps were all deliberately taken to make Patchfox approachable to a wider group of users and developers. This was the set up, for larger things.

I'm well aware of how grants work, and how being vague with what you will do, will hurt you in the end. So, I want to be laser focused on what I want to work on if provided new funding.

#### Add private message support

One crucial missing piece in Patchfox is private messaging. I don't mean the new private groups, I mean the old-style common private messages. At the moment, you can kinda read them in your timeline, but you can't write them.

I want to make private messaging a first-class feature by integrating it as a _Patchfox mini-app_ called _Inbox_.

#### Improve gathering support

At the moment, you can view gatherings, export them to your calendar application, and mark yourself as attending them. The missing feature is actually creating gatherings of your own. I'd like to improve many aspects of the gathering support, but most crucially, I'd like the user to be able to create new gatherings (and maybe even import from iCal files).

#### Wider browser release

Patchfox now [runs on Firefox, Chromium-based browsers, and Safari](%3nlg2WBM7N6ZKh3Ea0Kp3XLqA+/bXzGvE4/ONtsLpg8=.sha256). Getting it to run is just half of the game, getting it to ship on these browsers extension store, and working out any browser-specific quirks is much harder.

I'll work to get Patchfox into the Chrome Web Store and Mac App Store (yes, Mac App Store, that's where Safari Extensions live)

#### Safari work

Safari is a _"special"_ browser. The correct definition of _special_ is for each reader to decide. Anyway, WebExtensions on Safari are very different than on other browsers. Apple has a strong privacy focus, so WebExtensions get a ton more scrutiny. They are in fact bundled with a _native macOS Application_, this forces every WebExtension to go through the Mac App Store submission process, and allows Apple a tight control over the ecosystem. Having a _native app_ also enables us to bundle an _ssb-server_ with it, so maybe the glass is half-full.

I don't know if they'll ever approve something so flexible and broad as Patchfox, but I will try my best.

#### Go SSB support

It is my firm belief that go-ssb doesn't get more attention because no client is activelly trying to support it. The team behind it already has a ton in their plate to be able to focus on clients. I understand it is early days, and that there are features from the JS stack that are not present in the Go-based server. _I don't care, if it has enough features to be a pub, it has enough features to be a client._ I want Patchfox to be able to adapt running with go-ssb, even if it has to disable some of its own features, or work a bit slower because of some missing index.

This will probably require some extended refactoring, but I have a plan for how it can work. Read on, it is the next item.

#### Multiple identity support

There I said it, let's make it bold **MULTIPLE IDENTITIES**. Now, the developers reading this, please get your heads back into their natural position, all of you turned them to the side while reading this.

How will this work: Patchfox is a client-only client, and it will remain so. What I'll implement is: _if you run multiple servers on the same machine, such as running js sbot on a port and golang sbot on a different port, Patchfox will leverage the browser multiple tabs to connect to both of them_. 

Already in Patchfox, each tab opens its own connection to the running ssb server. It uses the saved identity. By saving multiple identities, the user would be able to open new tabs using some specific saved identity, thus connecting to a different local server.

SSB support is already contained in `/core/platforms/ssb`. To support go-ssb, I'd make a `core/platforms/go-ssb` that exposed the same high-level API as the other one. When connecting to a server, Patchfox would decide which _identity and platform_ should be used, and all the rest would remain the same (after some refactoring for packages that access sbot directly).

THIS CAN WORK. This will help go-ssb development. This will help any kind of new server development.

#### Double down on Scuttle Shell development

Scuttle Shell is a spin-off of Patchfox. It is what became of the _native-host app_ after we realised it was useful beyond the needs of Patchfox. Unfortunately, it has been neglected for a while mostly because shipping NodeJS binaries sucks, and because Patchwork bundles its own server and vendored plugins, making it harder for Scuttle Shell and Patchwork to run at the same time. I don't think I need to attempt to fix that problem anymore.

I have a much simpler Scuttle Shell codebase written in Go. It is just a fancy launcher, that helps you launch the correct apps and servers. With some more work, it can be made in a way that it bundles both a JS sbot and a Golang ssb-server, or offer to download them. By using go, the cross-compilation and shipping of standalone binaries is much easier.

Scuttle Shell could become the backbone of SSB on Desktops, it just require some more work.

### Final words

The items above are the ones I'd like to be covered by the new funding. Noticed that I haven't mentioned _bug fixing_ or any day to day maintenance work. These I'll be doing anyway. What I outlined above are _actionable features with clear deliverables_ that will make it easier for stakeholders to track progress and for me to measure success.

It will take many months to have all that was outlined above working, but when all that comes to fruition, we'll have a tools that make our ecosystem better and aid both users and developers on their daily tasks.

As mentioned in [Handshake grants revival](%SLWi09ibXFXKv2kBcPKzfrtIijkH9IfXU6Ns8+XUpRY=.sha256), there are some funds available. I'd love for Patchfox to receive some of that if possible. If people from the buttcouncil could make it happen, I would really appreciate. It is very hard to devote hours of work to something with just the OC individual donations.  If you're an individual and you want to see this done, please join the [Patchfox open collective](https://opencollective.com/patchfox), with enough small donors, this can become a really nice funding source.


