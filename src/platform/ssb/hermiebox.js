const privateBox = require("private-box")
const pullBoxStream = require("pull-box-stream")
const pullCat = require("pull-cat")
const pullDefer = require("pull-defer")
const pullIdentityFiletype = require("pull-identify-filetype")
const pullMany = require("pull-many")
const pullNext = require("pull-next")
const pullNextQuery = require("pull-next-query")
const pullPaginate = require("pull-paginate")
const pullParamap = require("pull-paramap")
const pullReader = require("pull-reader")
const pullReconnect = require("pull-reconnect")
const pullSplit = require("pull-split")
const pull = require("pull-stream")
const pullUtf8Decoder = require("pull-utf8-decoder")
const pullFileReader = require("pull-file-reader")
const ssbAvatar = require("ssb-avatar")
const ssbClient = require("ssb-client")
const ssbConfig = require("ssb-config")
const ssbFeed = require("ssb-feed")
const ssbGatheringSchema = require("ssb-gathering-schema")
const ssbGit = require("ssb-git")
const ssbKeys = require("ssb-keys")
const ssbMarkdown = require("ssb-markdown")
const ssbMarked = require("ssb-marked")
const ssbMentions = require("ssb-mentions")
const ssbRef = require("ssb-ref")
const ssbSort = require("ssb-sort")
const ssbWebResolver = require("ssb-web-resolver")
const streamToPullStram = require("stream-to-pull-stream")
const manifest = require("./manifest")


const api = {
    connect: function (keys, port = 8989) {
        return new Promise(function (resolve, reject) {
            ssbClient(keys, {
                manifest: manifest,
                remote: `ws://localhost:${port}/~shs:${keys.public}`,
                caps: {
                    shs: "1KHLiKZvAvjbY1ziZEHMXawbCEIM6qwjCDm3VYRan/s=",
                    sign: null
                }
            }, (err, server) => {
                if (err) {
                    reject(err)
                } else {
                    hermiebox.sbot = server
                    hermiebox.connected = true
                    resolve(server)
                }
            })
        })
    },

    createLogStream: function (opts) {
        opts = opts || {}
        return opts.sortByTimestamp
            ? this.createFeedStream(opts)
            : hermiebox.sbot.createLogStream(opts)
    },

    createFeedStream: function (opts) {
        // work around opts.gt being treated as opts.gte sometimes
        return pull(
            hermiebox.sbot.createFeedStream(opts),
            pull.filter(function (msg) {
                var ts = msg && msg.value && msg.value.timestamp
                return typeof ts === 'number' && ts !== opts.gt && ts !== opts.lt
            })
        )
    },


    pullPublic: function (extraOpts) {
        return new Promise((resolve, reject) => {
            let defaultOpts = {
                reverse: true,
                live: false
            }

            pull(
                hermiebox.sbot.createFeedStream(Object.assign(defaultOpts, extraOpts)),
                pull.filter(msg => msg && msg.value && msg.value.content),
                // pull.asyncMap(addNameToMsg(this.ssb)),
                pull.collect((err, msgs) => {
                    if (err) {
                        reject(err)
                    }

                    resolve(msgs)
                })
            )
        })
    },

    thread: function (msgid) {
        return new Promise((resolve, reject) => {
            var sort = hermiebox.modules.ssbSort
            var pull = hermiebox.modules.pullStream

            function getThread(sbot, id, cb) {
                sbot.get(id, function (err, value) {
                    if (err) return cb(err)
                    var rootMsg = { key: id, value: value }
                    pull(
                        sbot.backlinks && sbot.backlinks.read ? sbot.backlinks.read({
                            query: [
                                {
                                    $filter: {
                                        dest: id,
                                        value: {
                                            content: {

                                                root: id
                                            }
                                        }
                                    }
                                }
                            ]
                        }) : pull(
                            sbot.links({ dest: id, values: true, rel: 'root' }),
                            pull.filter(function (msg) {
                                var c = msg && msg.value && msg.value.content
                                return c && c.type === 'post' && c.root === id
                            }),
                            pull.unique('key')
                        ),
                        pull.collect(function (err, msgs) {
                            if (err) return cb(err)
                            cb(null, sort([rootMsg].concat(msgs)))
                        })
                    )
                })
            }

            getThread(hermiebox.sbot, msgid, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })

        })
    },

    get: function (id) {
        // ssb-ooo@1.0.1 (a50da3928500f3ac0fbead0a1b335a3dd5bbc096): raw=true
        // ssb-ooo@1.1.0 (f7302d12e56d566b84205bbc0c8b882ae6fd9b12): ooo=false
        return new Promise((resolve, reject) => {
            if (hermiebox.sbot.ooo) {
                hermiebox.sbot.get({ id: id, raw: true, ooo: false, private: true }, (err, data) => {
                    if (err) reject(err)
                    resolve(data)
                })
            } else {
                if (!hermiebox.sbot.private) {
                    // if no sbot.private, assume we have newer sbot that supports private:true
                    return hermiebox.sbot.get({ id: id, private: true }, (err, data) => {
                        if (err) reject(err)
                        resolve(data)
                    })
                }
                hermiebox.sbot.get(id, (err, data) => {
                    if (err) reject(err)
                    resolve(data)
                })
            }
        })
    },

    getMsgWithValue: function (id, cb) {
        return new Promise((resolve, reject) => {
            if (!id) reject("no id")
            this.get(id)
                .then((value) => {
                    resolve({ key: id, value: value })
                })
                .catch((err) => reject(err))
        })
    },

    avatar: function (key) {
        return new Promise((resolve, reject) => {
            ssbAvatar(hermiebox.sbot, hermiebox.sbot.id, key, function (err, data) {
                if (err) {
                    reject(err)
                } else if (data) {
                    resolve(data)
                } else {
                    reject("unknown error")
                }
            })
        })
    },

    aboutMessages: function (sourceId, destId) {
        return new Promise((resolve, reject) => {
            var pull = hermiebox.modules.pullStream

            let opts = {
                source: sourceId,
                dest: destId,
                rel: "about",
                values: true
            }

            pull(
                hermiebox.sbot.links(opts),
                pull.collect(function (err, data) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(data)
                    }
                })
            )
        })
    },

    profile: function (feedid) {
        return new Promise(async (resolve, reject) => {

            var pull = hermiebox.modules.pullStream

            try {
                let user = {
                    about: await this.aboutMessages(feedid, feedid)
                }

                resolve(user)
            } catch (n) {
                reject(n)
            }

        })
    },

    getBlob: function (blobid) {
        return new Promise((resolve, reject) => {
            let sbot = hermiebox.sbot
            sbot.blobs.want(blobid, function (err) {
                if (err) {
                    reject(err)
                } else {
                    var pull = hermiebox.modules.pullStream

                    pull(
                        sbot.blobs.get(blobid),
                        pull.collect(function (err, values) {
                            if (err) {
                                reject(err)
                            } else {
                                resolve(values)
                            }
                        })
                    )
                }
            })
        })
    }

}


const hermiebox = {
    connected: false,
    api,
    manifest,
    modules: {
        privateBox,
        pullBoxStream,
        pullCat,
        pullDefer,
        pullFileReader,
        pullIdentityFiletype,
        pullMany,
        pullNext,
        pullNextQuery,
        pullPaginate,
        pullParamap,
        pullReader,
        pullReconnect,
        pullSplit,
        pullStream: pull,
        pullUtf8Decoder,
        ssbAvatar,
        ssbClient,
        ssbConfig,
        ssbFeed,
        ssbGit,
        ssbKeys,
        ssbMarkdown,
        ssbMarked,
        ssbMentions,
        ssbRef,
        ssbSort,
        ssbWebResolver,
        streamToPullStram,
        ssbGatheringSchema
    }
}

global.hermiebox = hermiebox