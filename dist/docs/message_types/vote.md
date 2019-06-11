# vote
This message is akin to _likes_, _hearts_ and _stars_ in social networks. They represent an intention to support the message. Secure Scuttlebutt doesn't mandate a term to be used in this case and some clients will call it _like_ while others call it _dig_, it doesn't matter, the message structure is the same.

## How does it looks like?

~~~
{
  "key": "%p3LT5yzsfb/bPizfsgsEruyCeCgtqBY=.sha256",
  "value": {
    "previous": "%isvGQ2h9qnRiilXNssbXbi9pI+lTa1V4rpXpbT0=.sha256",
    "sequence": 549,
    "author": "@MRiJ+CvDnD9ZjqunY1oy6sfbsbMDC4Q3tTC8riS3s=.ed25519",
    "timestamp": 1560279862309,
    "hash": "sha256",
    "content": {
      "type": "vote",
      "channel": "patchfox",
      "vote": {
        "link": "%gZIjLirxZKxCMmczsbfsUeB+Yuz+4re67TNk=.sha256",
        "value": 1,
        "expression": "Like"
      }
    },
    "signature": "eIXFCiv3znd3p7/gtWfxUqTaV2ikHkmzKJiKFBJHPRWFsfbsbV4BnLIECva6waQhRgYTpWc9xD39B12a2DQ==.sig.ed25519"
  },
  "timestamp": 1560279864098,
  "rts": 1560279862309
}
~~~

On the message above you can see that the author is doing a _Like_ (as specified by the `expression` field) towards a message specified by the `link` field. The value `1` means a positive outcome, a value `-1` means withdrawing your positive vote from the message.

There is [more information about `vote` message](http://scuttlebot.io/docs/message-types/vote.html) available online.
