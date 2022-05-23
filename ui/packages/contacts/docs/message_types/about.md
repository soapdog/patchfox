# about (profile update)
About messages are used to add additional information to another message, much like attaching post-it notes to some book page. You're _attaching information about_ something. Most use cases of `about` messages are to add names, images and descriptions to a user profile.

> **Attention:** There is no central authority handling names on the Scuttleverse. Much like in the physical world where two people can have the exact same name so it is on Scuttlebutt.
>
> You can name other people as well, just like partners and friends do.


## What does it look like?

~~~
{
  "key": "%buRChtQMrk/WjZQsfsgsg17XHmSDnMMKfFEXv/bjL43lQ=.sha256",
  "value": {
    "previous": null,
    "sequence": 1,
    "author": "@G/zUdqlPsdgsgd8yXIfMjx1676ApAOghwgc=.ed25519",
    "timestamp": 1560287825423,
    "hash": "sha256",
    "content": {
      "type": "about",
      "about": "@G/zUdqlPMsdgsdg8yXIfMjx1676ApAOghwgc=.ed25519",
      "image": "&N3ectV2qM5gyH2Zrsdgsdgd+InCMkJBc/MaTbJ0=.sha256",
      "name": "Hilo",
      "description": "extrem klug"
    },
    "signature": "UMjf4aFsdgsgUY9zeDAqWdTZeymoQznicvfgATu0/kArvLnshqbkiG7ZIngXcnztMUc6SyI4GrDwkAA==.sig.ed25519"
  },
  "timestamp": 1560288248693,
  "rts": 1560287825423
}
~~~

The message above is adding a `name`, an `image` and a `description` to the user specified by the `about` field.

There is a lot more [information about `about` online](http://scuttlebot.io/docs/message-types/about.html).
