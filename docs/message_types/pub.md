# pub

`pub` messages are used for _pub announcements_. These are issued by [pub servers](https://github.com/ssbc/ssb-server/wiki/pub-servers) so that clients discover them.

## What they look like

```json
{
    "author": "@E5lOaTD+74yeVZhyGnPW9wSykpUGj6h8OjgVIoD4QdI=.ed25519",
    "content": {
        "address": {
            "host": "188.166.252.233",
            "key": "@uRECWB4KIeKoNMis2UYWyB2aQPvWmS3OePQvBj2zClg=.ed25519",
            "port": 8008
        },
        "type": "pub"
    },
    "hash": "sha256",
    "previous": "%c6bhBJfl1zWABSmV0sVWlTkklYTLxGHfSxt2LwA1ndM=.sha256",
    "sequence": 6,
    "signature": "4zTxKyyu8Gt24AGwTUrJO8FQ0Xit5OhgHTX+u6eB4FgNTK1ugKnEy7x91657+dQrCwjLHrYuE156/dy9cTpvCA==.sig.ed25519",
    "timestamp": 1459981972234
}
```

They match a _pub key_ with an accessible _host_. You can learn more about [pub messages online](http://scuttlebot.io/docs/message-types/pub.html).
