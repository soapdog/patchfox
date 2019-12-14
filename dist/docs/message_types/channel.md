# channel
This message is used to _subscribe and unsubscribe from channels_. Be aware that subscribing to a channel doesn't affect gossiping. Subscription mainly affects the display of common views such as _your public feed_ since most clients choose to display messages from your friends and the channels you subscribe on that view.

> **Important:** At the moment Patchfox ignores this information. In the future we plan to change the public view to take this into account.

## What does it looks like?

~~~
{
  "key": "%bh8KkBLWTK6iAUJ3u4g2bfkye40m4vNw3+D6UFi8=.sha256",
  "value": {
    "previous": "%y+XwGARQFqvlMRnwfberbwr5+93pskchI+h/A=.sha256",
    "sequence": 179,
    "author": "@zVgfPY/wrpkjebfbkjqlDderiZr7jCbOpR1k=.ed25519",
    "timestamp": 1560279944413,
    "hash": "sha256",
    "content": {
      "type": "channel",
      "channel": "p2p-berlin",
      "subscribed": true
    },
    "signature": "958n47tZTbwmDLjCcunaR9F18zAHOJeMt01P02OrPzaS9y6cjXpeq5/uh9zDhzfVCt5I4hsukLXkdjOSVZNMAQ==.sig.ed25519"
  },
  "timestamp": 1560279947258,
  "rts": 1560279944413
}
~~~

On the message above you can see that the author `subscribed` to the channel called `p2p-berlin`. The `subscribed` field is a boolean that indicates if the author is subscribing or unsubscribing from the channel.
