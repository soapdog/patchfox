# more-info

Messages of type `more-info` are **PRIVATE** messages sent from one feed to itself that attach additional metadata about some user. They are used to provide _address book_ features to SSB. Only the issuer of a `more-info` message can read it, so the data attached to a profile is private.

At the moment Patchfox is the only client that supports `more-info` messages.

## What they look like

```json
{
  "key": "%buRChnotexistk/WjZQsfsgsg17XHmSDnMMKfFEXv/bjL43lQ=.sha256",
  "value": {
    "previous": null,
    "sequence": 1,
    "author": "@G/zUdqlPsdgsgd8yXIfMjx1676ApAOghwgc=.ed25519",
    "timestamp": 1560287825423,
    "hash": "sha256",
    "content": {
      "type": "more-info",
      "about": "@G/zUdqlPMsdgsdg8yXIfMjx1676ApAOghwgc=.ed25519",
      "luckyNumbers": ["1","2","3"],
      "fields": [
      	{"name": "primary email", "type": "email", "value": "example@example.com"},
      	{"name": "blog", "type": "URL", "value": "https://example.com"}
      ]
    },
    "signature": "UMjf4aFsdgsgUY9zeDAqWdTZeymoQznicvfgATu0/aaaa==.sig.ed25519"
  },
  "timestamp": 1560288248693,
  "rts": 1560287825423
}

```

_PS: the message above is fake. I'm not going to post a real `more-info` message here since they're PRIVATE._
