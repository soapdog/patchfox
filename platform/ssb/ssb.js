import pull from "../../web_modules/pull-stream.js"

let threads = {
    public: opts => {
        return new Promise((resolve, reject) => {
            if (!ssb.sbot) {
                reject("Error: no sbot")
                return false
            }

            opts = opts || {}
            opts.reverse = opts.reverse || true

            const pipeline = ssb.pipelines.thread.get()

            pull(
                ssb.sbot.createFeedStream(opts),
                pull.filter(msg => msg && msg.value && msg.value.content),
                pull.apply(pull, pipeline),
                pull.collect((err, msgs) => {
                    if (err) {
                        reject(err)
                    }

                    resolve(msgs)
                })
            )
        })
    },
    mentions: (feed, opts) => {
        return new Promise((resolve, reject) => {
            if (!ssb.sbot) {
                reject("Error: no sbot")
                return false
            }

            if (!feed) {
                reject("Error: no feed")
                return false
            }

            const createBacklinkStream = id => {
                var filterQuery = {
                    $filter: {
                        dest: id
                    }
                };

                if (opts && opts.lt) {
                    filterQuery.$filter.value = { timestamp: { $lt: opts.lt } };
                }

                return ssb.sbot.backlinks.read({
                    query: [filterQuery],
                    index: "DTA", // use asserted timestamps
                    reverse: true,
                });
            };

            const pipeline = ssb.pipelines.thread.get()

            pull(
                createBacklinkStream(feed),
                pull.apply(pull, pipeline),
                pull.collect((err, msgs) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(msgs)
                    }
                })
            );
        })
    },
    get: id => {
        return new Promise((resolve, reject) => {
            if (!ssb.sbot) {
                reject("Error: no sbot")
                return false
            }

            if (!id) {
                reject("Error: no feed")
                return false
            }

            const pipeline = ssb.pipelines.thread.get()


            ssb.sbot.get(id, (err, value) => {
                if (err) return reject(err)
                var rootMsg = { key: id, value: value }
                pull(
                    ssb.sbot.backlinks && ssb.sbot.backlinks.read ? ssb.sbot.backlinks.read({
                        query: [{
                            $filter: {
                                dest: id
                            }
                        }],
                        reverse: true
                    }) : pull(
                        ssb.sbot.links({ dest: id, values: true, rel: 'root' }),
                        pull.unique('key')
                    ),
                    pull.apply(pull, pipeline),
                    pull.collect((err, msgs) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(ssbSort([rootMsg].concat(msgs)))
                        }
                    })
                )
            })
        })
    }
}

let pipelines = {
    threadPipes: new Set(),
    messagePipes: new Set(),
    thread: {
        use: func => pipelines.threadPipes.add(func),
        get: () => [...pipelines.threadPipes].map(p => p.apply(p))
    },
    message: {
        use: func => pipelines.messagePipes.add(func),
        get: () => [...pipelines.messagePipes].map(p => p.apply(p))
    }
}


let _caches = {
    feeds: {}
}

let ssb = {
    // ssbClient is a browserified version of ssb-client
    // it is added as a global because ESM can't contain
    // octals with leading zero which ssb-client contains.
    client: ssbClient,
    // upon connection sbot will contain a valid sbot
    sbot: false,
    // holds users id
    id: false,
    // connects to an ssb-server, updates "sbot"
    connect: (keys, remote) => {
        return new Promise(function (resolve, reject) {
            let port = 8989

            if (!keys) {
                reject("no keys passed to ssb.connect()")
                return false
            }

            if (ssb.sbot) {
                resolve(ssb.sbot)
            } else {
                ssbClient(keys, {
                    remote: remote || `ws://127.0.0.1:${port}/~shs:${keys.public}`,
                    caps: {
                        shs: "1KHLiKZvAvjbY1ziZEHMXawbCEIM6qwjCDm3VYRan/s=",
                        sign: null
                    }
                }, (err, server) => {
                    if (err) {
                        reject("error: can't connect to sbot")
                    } else {
                        ssb.sbot = server
                        console.log("you are", server.id)
                        ssb.id = server.id
                        resolve(server)
                    }
                })
            }
        })
    },
    // code for acquiring common thread patterns
    threads,
    // pipelines are used to insert steps into pull-streams
    pipelines,
    // I'm going to try to make caches an internal usage prop.
    // it is early days so I'm adding it to the exported object,
    // but if I'm successful, I'll be able to remove it from it
    // without any side-effect.
    _caches,

}

export default ssb