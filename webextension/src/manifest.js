const manifest = {
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
  "progress": "sync",
  "status": "sync",
  "getVectorClock": "async",
  "seq": "async",
  "usage": "sync",
  "clock": "async",
  "gossip": {
    "peers": "sync",
    "add": "sync",
    "remove": "sync",
    "ping": "duplex",
    "connect": "async",
    "changes": "source",
    "reconnect": "sync",
    "enable": "sync",
    "disable": "sync"
  },
  "replicate": {
    "changes": "source",
    "upto": "source",
    "request": "sync"
  },
  "friends": {
    "get": "async",
    "createFriendStream": "source",
    "stream": "source",
    "hops": "async"
  },
  "blobs": {
    "get": "source",
    "getSlice": "source",
    "add": "sink",
    "rm": "async",
    "ls": "source",
    "has": "async",
    "size": "async",
    "meta": "async",
    "want": "async",
    "push": "async",
    "changes": "source",
    "createWants": "source"
  },
  "invite": {
    "create": "async",
    "accept": "async",
    "use": "async"
  },
  "ooo": {
    "stream": "duplex",
    "get": "async"
  },
  "ebt": {
    "replicate": "duplex",
    "_dump": "source",
    "request": "sync"
  },
  "ws": {
    "getAddress": "sync"
  },
  "names": {
    "get": "async",
    "getImages": "async",
    "getImageFor": "async",
    "getSignifier": "async",
    "getSignifies": "async",
    "dump": "sync"
  }
}

export default manifest