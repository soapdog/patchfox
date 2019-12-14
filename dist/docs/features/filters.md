# Abuse Prevention tools coming to Patchfox

This is not the real documentation, this is an interim blurb from [a message posted on SSB about the feature](ssb:%t3LIs8w3lMgEBGMY+Xk0hrJyszw0iLn4mOPKF39Q++w=.sha256). I'll write proper docs short.

**The next release of Patchfox will be focused on providing abuse prevention tools** 
so that users can self moderate their Scuttlebutt experience. These tools will not affect gossiping or data storage, they will only act on displaying data.

## Filters

The first type of tool I'm gonna ship is _filters_. Users can create their own custom filters specifying the feed it should act upon, the channel and/or the keywords. Any combination is valid, if they ring true for a given message then the action is triggered. There are two types of actions: **Hiding the message** and **Bluring images**. It is your choice what to use. You can also set an expiration date for a given filter. For example, is there a user who you like that is talking about some current event topic that is something you do not want to hear about? You can create a filter with that user, select hide message, and give it an expiration date of a couple days. After that period is done, you'll see that user again (and will also see the past posts, be aware).

![A bad gif showing filters](../_media/filters.gif)
_Sorry for the gif quality, it is hard to keep them below 5mb._

On the gif above you can see me setting some toy filters, just to show how it is done. 

Filters are saved to patchfox itself, they are not on the feed.

🌴✨💖💕🚀 **Do you think working on abuse prevention tools is a good thing? Then become a backer of the [Patchfox Open Collective](https://opencollective.com/patchfox) and help fund more work on this project.** 🌴✨💖💕🚀 
