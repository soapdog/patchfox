var manifest = {
  "auth": "async",
  "address": "sync",
  "manifest": "sync",
  "get": "async",
  "createFeedStream": "source",
  "createLogStream": "source",
  "messagesByType": "source",
  "createHistoryStream": "source",
  "createUserStream": "source",
  "links": "source",
  "relatedMessages": "async",
  "add": "async",
  "publish": "async",
  "getAddress": "sync",
  "getLatest": "async",
  "latest": "source",
  "latestSequence": "async",
  "whoami": "sync",
  "usage": "sync",
  "gossip": {
    "peers": "sync",
    "add": "sync",
    "ping": "duplex",
    "connect": "async",
    "changes": "source",
    "reconnect": "sync"
  },
  "friends": {
    "all": "async",
    "hops": "async",
    "createFriendStream": "source",
    "get": "sync"
  },
  "replicate": {
    "changes": "source"
  },
  "invite": {
    "create": "async",
    "accept": "async",
    "use": "async"
  },
  "block": {
    "isBlocked": "sync"
  },
  "names": {
    "get": "async",
    "getImages": "async",
    "getImageFor": "async",
    "getSignifier": "async",
    "getSignifies": "async",
    "dump": "sync"
  },
  "private": {
    "publish": "async",
    "unbox": "sync"
  },
  "blobs": {
    "get": "source",
    "add": "sink",
    "ls": "source",
    "has": "async",
    "size": "async",
    "meta": "async",
    "want": "async",
    "push": "async",
    "changes": "source",
    "createWants": "source"
  },
  "links2": {
    "read": "source",
    "dump": "source"
  },
  "backlinks": {
    "read": "source",
    "dump": "source"
  },
  "query": {
    "read": "source",
    "dump": "source"
  },
  "ws": {},
  "search": {
    "query": "source"
  }
}

module.exports = manifest