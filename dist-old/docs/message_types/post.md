# post
Post messages are text-based messages intended for a public or private audience. They are what you normally see on feeds from social networks and make most of the meaningful interaction in Scuttlebutt at the moment.

> **Attention:** Patchfox currently doesn't support private messages.

## What does it look like? 

~~~
{
  "key": "%gZIjLirxZKxCMmcsoud/bC0pL68UeB+Yuz+4re67TNk=.sha256",
  "value": {
    "previous": "%X8PLQuBhdUA+WF5VANRfG5iAKMNAeBXxlAtd9SKDAtM=.sha256",
    "sequence": 251,
    "author": "@qv10rF4IsmxRZb7g5ekJ33EakYBpdrmV/vtP1ij5BS4=.ed25519",
    "timestamp": 1560279840471,
    "hash": "sha256",
    "content": {
      "type": "post",
      "text": "YES WE CAN! :heart: :smiley_cat:",
      "root": "%Yx6/snCfur1NHd9fov8H359DfqTyncxuh93uZKnLQI8=.sha256",
      "branch": "%X8PLQuBhdUA+WF5VANRfG5iAKMNAeBXxlAtd9SKDAtM=.sha256",
      "channel": "patchfox"
    },
    "signature": "nP2guRVtAJrvJpmcwG/K+mn4JgNANkK19+aiw+Y/Dn6axBBDB3sGfXKq/cXvrzurW1TB1yszzZebDrk3j+UBBA==.sig.ed25519"
  },
  "timestamp": 1560279840471.001,
  "rts": 1560279840471
}
~~~

These messages have a lot of fields. Lets go through the most important ones:

* `text`: This is a Markdown-based textual content that is the body of your message. The other users will see a rendered version of this content.
* `root`: In case this message is part of a thread of messages. The `root` fields points at the topmost message.
* `branch`: If this message is a reply to another message, then `branch` points at the message this message is replying to.
* `channel`: The channel this message is being posted to. It works much like hashtags but don't need to be present in the content itself.

There are other fields such as `recps`- which holds the recipients for the messages and is used by private messages- and `mentions`- which is used to help link mentioned users and messages.

There is [more information about posts online](http://scuttlebot.io/docs/message-types/post.html).
