# Abuse Prevention Tools Coming to Patchfox

This page is an interim blurb based on [a message posted on SSB about the feature](ssb:%t3LIs8w3lMgEBGMY+Xk0hrJyszw0iLn4mOPKF39Q++w=.sha256). Full documentation is forthcoming.

**The next release of Patchfox will be focused on providing abuse prevention tools** so that users can self-moderate their Scuttlebutt experience. These tools will not affect gossiping or data storage; they will only act on displaying data.

## Filters

The first upcoming tool is _filters_. Users can create a custom filter that targets a feed, a channel, or a set of keywords. Any combination is valid, and if they match a given message then the action is triggered. There are two options for filter actions: **Hiding the message** and **Blurring images**.

You can also set an expiration date for a filter. For example, if someone you like is talking about a current event that you do not want to hear about, you can filter that user temporarily for a couple days. After the time range expires, you'll see their posts again. Keep in mind that you will also see the past posts.

![A bad gif showing filters](../_media/filters.gif)
_Sorry for the gif quality, it is hard to keep them below 5MB._

The above gif demonstrates the filter UX.

Filters are saved locally in your Patchfox configuration. They are not broadcast publicly to the SSB network.

🌴✨💖💕🚀 **Do you think working on abuse prevention tools is a good thing? Then become a backer of the [Patchfox Open Collective](https://opencollective.com/patchfox) and help fund more work on this project.** 🌴✨💖💕🚀 
