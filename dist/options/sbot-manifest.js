var manifest = {
    "auth": "async",
    "address": "sync",
    "manifest": "sync",
    "multiserver": {
        "parse": "sync",
        "address": "sync"
    },
    "get": "async",
    "createFeedStream": "source",
    "createLogStream": "source",
    "messagesByType": "source",
    "createHistoryStream": "source",
    "createUserStream": "source",
    "createWriteStream": "sink",
    "links": "source",
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
    "version": "sync",
    "seq": "async",
    "usage": "sync",
    "clock": "async",
    "plugins": {
        "install": "source",
        "uninstall": "source",
        "enable": "async",
        "disable": "async"
    },
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
    "invite": {
        "create": "async",
        "accept": "async",
        "use": "async"
    },
    "about": {
        "socialValue": "async",
        "latestValue": "async",
        "socialValues": "async",
        "latestValues": "async",
        "socialValueStream": "source",
        "socialValuesStream": "source",
        "latestValueStream": "source",
        "read": "source"
    },
    "backlinks": {
        "read": "source"
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
    "chessDb": {
        "pendingChallengesSent": "async",
        "pendingChallengesReceived": "async",
        "getGamesAgreedToPlayIds": "async",
        "getObservableGames": "async",
        "getGamesFinished": "source",
        "getAllGamesInDb": "source",
        "gameHasPlayer": "async",
        "weightedPlayFrequencyList": "async"
    },
    "ebt": {
        "replicate": "duplex",
        "request": "sync",
        "peerStatus": "sync"
    },
    "friends": {
        "hopStream": "source",
        "onEdge": "sync",
        "isFollowing": "async",
        "isBlocking": "async",
        "hops": "async",
        "get": "async",
        "createFriendStream": "source",
        "stream": "source"
    },
    "links2": {
        "read": "source"
    },
    "names": {
        "get": "async",
        "getImages": "async",
        "getImageFor": "async",
        "getSignifier": "async",
        "getSignifies": "async",
        "dump": "sync"
    },
    "meme": {
        "query": "source",
        "search": "async"
    },
    "ooo": {
        "stream": "duplex",
        "get": "async"
    },
    "private": {
        "publish": "async",
        "unbox": "sync",
        "read": "source"
    },
    "query": {
        "read": "source",
        "explain": "sync"
    },
    "search": {
        "query": "source"
    },
    "tags": {
        "stream": "source",
        "get": "async"
    },
    "talequery": {
        "read": "source"
    },
    "threads": {
        "public": "source",
        "publicUpdates": "source",
        "profile": "source",
        "thread": "source"
    },
    "unread": {
        "isRead": "async",
        "markRead": "async"
    },
    "ws": {
        "getAddress": "sync"
    }
};

console.log("manifest", manifest);