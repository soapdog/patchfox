/**
 * NodeJS SSB
 *
 * Things I don't currently like here:
 * - usage of getPref and abuse prevention. This should be pluggable!
 *
 * This file is fucking big and needs to be refactored.
 */

// const { getPref } = require("../../kernel/prefs.js")
// const { isMessageHidden } = require("./abusePrevention.js")

const pull = require("pull-stream")
const sort = require("ssb-sort")
const ssbMarkdown = require("ssb-markdown")
const ssbRef = require("ssb-ref")
const ssbMentions = require("ssb-mentions")
const ssbClient = require("ssb-client-for-browser")
const ssbAvatar = require("ssb-avatar")
const pullParallelMap = require("pull-paramap")
const pullSort = require("pull-sort")
const _ = require("lodash")
const ssbHttpInviteClient = require("ssb-http-invite-client")
const ssbHttpAuthClient = require("ssb-http-auth-client")
const ssbRoomClient = require("ssb-room-client")
const fileReader = require("pull-file-reader")
const queryString = require("query-string");

const rooms2 = require("./rooms2.js")
const system = require("./system.js")
const friendship = require("./friendship.js")

const defaultOptions = {
  private: true,
  reverse: true,
  meta: true,
}

const pipelines = {
  threadPipes: new Set(),
  messagePipes: new Set(),
  thread: {
    use: (func) => pipelines.threadPipes.add(func),
    get: () => [...pipelines.threadPipes].map((p) => p.apply(p)),
  },
  message: {
    use: (func) => pipelines.messagePipes.add(func),
    get: () => [...pipelines.messagePipes].map((p) => p.apply(p)),
  },
}

const configure = (...customOptions) =>
  Object.assign({}, defaultOptions, ...customOptions)

const caches = {}
const cacheResult = (kind, msgId, value) => {
  let key = `cache-${kind}-${msgId}`
  caches[key] = {
    time: Date.now(),
    value,
  }
}
const invalidateCacheResult = (kind, msgId) => {
  let key = `cache-${kind}-${msgId}`
  delete caches[key]
}

const resultFromCache = (kind, msgId, falseIfOlderThan) => {
  let key = `cache-${kind}-${msgId}`
  let currentDate = Date.now()
  if (caches.hasOwnProperty(key)) {
    let expiryDate = caches[key].time + falseIfOlderThan * 1000
    if (expiryDate > currentDate) {
      return caches[key].value
    }
  }
  // console.log("no cached result for", key)
  return false
}

const workQueue = {}
let parallelJobs = 0
const maxParallelJobs = 5
const enqueue = (kind, msgId, falseIfOlderThan, work, cb) => {
  let key = `queue-${kind}-${msgId}`
  let possibleResult = resultFromCache(kind, msgId, falseIfOlderThan)

  if (possibleResult) {
    cb(possibleResult)
  } else {
    if (workQueue.hasOwnProperty(key)) {
      // is in the queue, should wait for result.
      setTimeout(() => {
        enqueue(kind, msgId, falseIfOlderThan, work, cb)
      }, (falseIfOlderThan * 1000) / 2)
    } else {
      // not in the queue, should enqueue and block for  result.
      workQueue[key] = { work, cb, kind, msgId }
    }
    processQueue()
  }
}

const processQueue = () => {
  if (Object.keys(workQueue).length > 0 && parallelJobs < maxParallelJobs) {
    // entries in the queue.
    let jobs = Object.keys(workQueue).slice(0, maxParallelJobs)
    parallelJobs += jobs.length

    jobs.forEach(async (job) => {
      let work = workQueue[job]
      try {
        // console.log("starting job...", job)
        let res = await work.work()
        cacheResult(work.kind, work.msgId, res)
        delete workQueue[job]
        work.cb(res)
        console.log("remaining jobs", Object.keys(workQueue).length)
        setTimeout(processQueue, 10)
      } catch (n) {
        console.log("work", work)
        console.error("error with work", n)
      }
      parallelJobs = parallelJobs >= 0 ? parallelJobs - 1 : 0
    })
  }
}

let sbot = false
let getPref = () => false
let isMessageHidden = () => false

let avatarCache = {}

const getMsgCache = (id) => {
  let data = sessionStorage.getItem(id)
  if (data) {
    try {
      return JSON.parse(data)
    } catch (n) {
      sessionStorage.removeItem(id)
      return false
    }
  } else {
    return false
  }
}

const setMsgCache = (id, data) => {
  sessionStorage.setItem(id, JSON.stringify(data))
}

class NodeJsSSB {
  constructor() {
    this.platform = "nodejs-ssb"

    // add basic built-in pipelines
    pipelines.thread.use(this.filterHasContent)
    pipelines.thread.use(this.filterTypes)
    // pipelines.thread.use(this.filterRemovePrivateMsgs)
    pipelines.thread.use(this.filterWithUserFilters)
    // pipelines.thread.use(this.transform)
    pipelines.thread.use(this.filterLimit)

    pipelines.message.use(this.filterHasContent)
    pipelines.message.use(this.filterTypes)
    // pipelines.message.use(this.filterRemovePrivateMsgs)
    pipelines.message.use(this.filterWithUserFilters)
    // pipelines.message.use(this.transform)

    this.rooms2 = rooms2
    this.system = system
    this.friendship = friendship
  }

  log(pMsg, pVal = "") {
    console.log(`[SSB API] - ${pMsg}`, pVal)
  }

  setGetPrefFunction(gp) {
    getPref = gp
  }

  setIsMessageHiddenFunction(ish) {
    isMessageHidden = ish
  }

  connect(keys, remote) {
    let port = remote.match(/:([0-9]*)~/)[2] 

    if (!keys) {
      throw "no keys passed to ssb.connect()"
    }
    return new Promise(function (resolve, reject) {
      if (sbot) {
        resolve(sbot)
      } else {
        ssbClient(
          keys,
          {
            remote: remote || `ws://127.0.0.1:${port}/~shs:${keys.public}`,
            caps: {
              shs: "1KHLiKZvAvjbY1ziZEHMXawbCEIM6qwjCDm3VYRan/s=",
              sign: null,
            },
          },
          (err, server) => {
            if (err) {
              reject("can't connect to sbot")
            } else {
              sbot = server

              /**
               * Force plugins needed by Rooms 2.0
               *
               * This is dangerous territory as it includes
               * faking, wrapping, and polyfilling stuff so that
               * ssb-client looks like ssb-server.
               *
               * hack: a ton of shit going on to make ssb-client pretend to be ssb-server.
               */

              sbot.httpInviteClient = ssbHttpInviteClient.init(sbot)

              // hack: apparently `ssb-client` has no `hook()` in `sbot.close()`, so we no-op'd a polyfill.
              sbot.close.hook = (data) => {
                console.warn(
                  "sbot.close is a no-op polyfill, doesn't actually work."
                )
              }

              console.log("you are", server.id)
              resolve(server)
            }
          }
        )
      }
    })
  }

  filterHasContent() {
    return pull.filter((msg) => msg && msg.value && msg.value.content)
  }

  filterRemovePrivateMsgs() {
    return pull.filter(
      (msg) => msg && msg.value && typeof msg.value.content !== "string"
    )
  }

  async filterFollowing() {
    return await this.socialFilter({ following: true })
  }

  filterLimit() {
    let limit = getPref("limit", 10)
    return pull.take(Number(limit))
  }

  filterWithUserFilters() {
    return pull.filter((m) => {
      let res = isMessageHidden(m)
      if (!res) {
        console.log(`msg ${m.key} has been filtered.`)
      }
      return res
    })
  }

  filterTypes() {
    // TODO: needs better handling that makes it easier to extend known types.
    let knownMessageTypes = {
      post: "showTypePost",
      about: "showTypeAbout",
      vote: "showTypeVote",
      contact: "showTypeContact",
      pub: "showTypePub",
      blog: "showTypeBlog",
      channel: "showTypeChannel",
    }

    let showUnknown = false

    if (showUnknown) {
      return pull.filter(() => true)
    }

    return pull.filter((msg) => {
      let type = msg.value.content.type

      if (typeof type == "string" && knownMessageTypes[type]) {
        return getPref(knownMessageTypes[type], true)
      }
      return getPref("showTypeUnknown", false)
    })
  }

  public(opts) {
    return new Promise((resolve, reject) => {
      opts = opts || {}
      opts.reverse = opts.reverse || true

      const pipeline = pipelines.thread.get()

      pull(
        sbot.createFeedStream(opts),
        pull.apply(pull, pipeline),
        pull.collect((err, msgs) => {
          if (err) {
            reject(err)
          }

          resolve(msgs)
        })
      )
    })
  }

  thread(id) {
    return new Promise((resolve, reject) => {
      const pipeline = pipelines.message.get()

      sbot.get(id, (err, value) => {
        if (err) return reject(err)
        var rootMsg = { key: id, value: value }
        pull(
          sbot.backlinks && sbot.backlinks.read
            ? sbot.backlinks.read({
              query: [
                {
                  $filter: {
                    dest: id,
                  },
                },
              ],
              reverse: true,
            })
            : pull(
              sbot.links({ dest: id, values: true, rel: "root" }),
              pull.unique("key")
            ),
          pull.apply(pull, pipeline),
          pull.collect((err, msgs) => {
            if (err) reject(err)
            resolve(sort([rootMsg].concat(msgs)))
          })
        )
      })
    })
  }

  mentions(feed, lt) {
    return new Promise((resolve, reject) => {
      const pipeline = pipelines.thread.get()

      const createBacklinkStream = (id) => {
        var filterQuery = {
          $filter: {
            dest: id,
          },
        }

        if (lt) {
          filterQuery.$filter.value = { timestamp: { $lt: lt } }
        }

        return sbot.backlinks.read({
          query: [filterQuery],
          index: "DTA", // use asserted timestamps
          reverse: true,
        })
      }

      const uniqueRoots = (msg) => {
        return pull.filter((msg) => {
          let msgKey = msg.key
          if (msg.value.content.type !== "post") {
            return true
          }
          let rootKey = msg.value.content.root || false
          if (rootKey) {
            if (msgs.some((m) => m.value.content.root === rootKey)) {
              return false
            }
          }
          return true
        })
      }

      const mentionUser = (msg) => {
        return pull.filter((msg) => {
          if (msg.value.content.type !== "post") {
            return true
          }
          let mentions = msg.value.content.mentions || []
          if (mentions.some((m) => m.link == sbot.id)) {
            return true
          }
          return false
        })
      }

      pull(
        createBacklinkStream(sbot.id),
        pull.apply(pull, pipeline),
        pull.collect((err, msgs) => {
          if (err) {
            reject(err)
          } else {
            resolve(msgs)
          }
        })
      )
    })
  }
  
  private(lt, query = {}) {
    return new Promise((resolve, reject) => {
      const pipeline = pipelines.thread.get()
  
      const createPrivateStream = (id) => {
        var filterQuery = {
          $filter: {
            dest: id,
          },
        }
  
        if (lt) {
          filterQuery.$filter.value = { timestamp: { $lt: lt } }
        }
        
        filterQuery = _.merge(filterQuery, query)
        console.log(filterQuery)
  
        return sbot.private.read({
          query: [query],
          index: "DTA", // use asserted timestamps
          reverse: true,
        })
      }
  
      pull(
        createPrivateStream(sbot.id),
        pull.apply(pull, pipeline),
        pull.collect((err, msgs) => {
          if (err) {
            reject(err)
          } else {
            resolve(msgs)
          }
        })
      )
    })
  }

  search(query, lt) {
    return new Promise((resolve, reject) => {
      const pipeline = pipelines.thread.get()

      let q = query.toLowerCase()
      let limit = parseInt(getPref("limit", 10))
      pull(
        pull((sbot) => sbot.search.query({ q, limit })),
        pull.apply(pull, pipeline),
        pull.collect((err, msgs) => {
          if (err) {
            reject(err)
          } else {
            resolve(msgs)
          }
        })
      )
    })
  }

  searchWithCallback(query, cb) {
    const matchesQuery = searchFilter(query.split(" "))
    const opts = { reverse: true, live: true, private: true }

    function searchFilter(terms) {
      return function (msg) {
        if (msg.sync) return true
        const c = msg && msg.value && msg.value.content
        return (
          c &&
          (msg.key === terms[0] ||
            andSearch(
              terms.map(function (term) {
                return new RegExp("\\b" + term + "\\b", "i")
              }),
              [c.text, c.name, c.title]
            ))
        )
      }
    }

    function andSearch(terms, inputs) {
      for (let i = 0; i < terms.length; i++) {
        let match = false
        for (let j = 0; j < inputs.length; j++) {
          if (terms[i].test(inputs[j])) match = true
        }
        // if a term was not matched by anything, filter this one
        if (!match) return false
      }
      return true
    }

    return new Promise((resolve, reject) => {
      if (sbot) {
        try {
          let q = query.toLowerCase()
          pull(
            sbot.createLogStream(opts),
            pull.filter(matchesQuery),
            //this.filterTypes(),
            //this.filterWithUserFilters(),
            //this.filterLimit(),
            pull.drain(
              (msg) => {
                if (!msg.sync) {
                  cb(msg)
                }
              },
              () => resolve()
            )
          )
        } catch (e) {
          reject(e)
        }
      } else {
        reject("no sbot")
      }
    })
  }

  aboutMessages(sourceId, destId) {
    return new Promise((resolve, reject) => {
      let opts = {
        source: sourceId,
        dest: destId,
        rel: "about",
        values: true,
      }

      pull(
        sbot.links(opts),
        pull.collect(function (err, data) {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        })
      )
    })
  }

  async profile(feedid) {
    return new Promise(async (resolve, reject) => {
      let opts = {
        id: feedid,
        reverse: true,
      }

      let user = {
        msgs: [],
        about: await this.aboutMessages(feedid, feedid),
      }

      const pipeline = pipelines.thread.get()

      pull(
        sbot.createUserStream(opts),
        pull.apply(pull, pipeline),
        pull.collect(function (err, data) {
          if (err) {
            reject(err)
          } else {
            user.msgs = data
            resolve(user)
          }
        })
      )
    })
  }

  get(id) {
    return new Promise((resolve, reject) => {
      // if (getMsgCache(id)) {
      //   resolve(getMsgCache(id))
      // }
      if (sbot.ooo) {
        sbot.get(
          { id: id, raw: true, ooo: false, private: true },
          (err, data) => {
            if (err) reject(err)
            setMsgCache(id, data)
            resolve(data)
          }
        )
      } else {
        if (!sbot.private) {
          // if no sbot.private, assume we have newer sbot that supports private:true
          return sbot.get({ id: id, private: true }, (err, data) => {
            if (err) reject(err)
            setMsgCache(id, data)
            resolve(data)
          })
        }
        sbot.get(id, (err, data) => {
          if (err) reject(err)
          setMsgCache(id, data)
          resolve(data)
        })
      }
    })
  }

  addBlob(file) {
    return new Promise((resolve, reject) => {
      pull(
        fileReader(file),
        sbot.blobs.add(function(err, hash) {
          // 'hash' is the hash-id of the blob
          if (err) {
            reject(err)
          } else {
            resolve(hash)
          }
        })
      )
    })
  }

  async setAvatarCache(feed, data) {
    let s = {}
    s[`profile-${feed}`] = data
    return browser.storage.local.set(s)
  }

  async getCachedAvatar(feed) {
    return browser.storage.local.get(`profile-${feed}`)
  }

  getAllCachedUsers() {
    return avatarCache
  }

  async avatar(feed) {
    const avatarPromise = (key) => {
      return new Promise((resolve, reject) => {
        ssbAvatar(sbot, sbot.id, key, function (err, data) {
          if (err) {
            reject(err)
          } else if (data) {
            resolve(data)
          } else {
            reject("unknown error")
          }
        })
      })
    }

    const getAvatarAux = async (feed) => {
      let avatar = await avatarPromise(feed)
      // await this.setAvatarCache(feed, avatar)
      avatarCache[feed] = avatar
      localStorage.setItem(`profile-${feed}`, JSON.stringify(avatar))
      return avatar
    }

    if (avatarCache[feed]) {
      setTimeout(() => getAvatarAux(feed), 300) // update cache...
      return avatarCache[feed]
    }
    try {
      return getAvatarAux(feed)
    } catch (n) {
      throw n
    }
  }

  async loadCaches() {
    console.time("avatar cache")
    let allSavedData = { ...localStorage }
    delete allSavedData["/.ssb/secret"]
    let keys = Object.keys(allSavedData)
    keys.forEach((k) => {
      let key = k.replace("profile-", "")
      try {
        avatarCache[key] = JSON.parse(allSavedData[k])
      } catch (n) {
        localStorage.removeItem(`profile-${k}`)
      }
    })

    console.timeEnd("avatar cache")
    console.log(`cached ${Object.keys(avatarCache).length} users`)
  }

  async blurbFromMsg(msgid, howManyChars) {
    let retVal = msgid
    let data
    try {
      if (getMsgCache(msgid)) {
        data = getMsgCache(msgid)
      } else {
        data = await ssb.get(msgid)
      }

      if (typeof data === "undefined" || typeof data === "null") {
        retVal = `Patchfox error: message ${msgid} is null`
      }

      // if (data.content.type == "post") {
      retVal =
        this.plainTextFromMarkdown(data.content.text).slice(0, howManyChars) +
        "..."
      // }
      return retVal
    } catch (n) {
      console.log("booom", n)
      return retVal
    }
  }

  plainTextFromMarkdown(text) {
    // TODO: this doesn't belong here
    let html = this.markdown(text)
    let div = document.createElement("div")
    div.innerHTML = html
    let ret = div.innerText
    return div.innerText
  }

  markdown(text, removePara = false) {
    let cs = queryString.parse(location.search)
    let identity = ""
    
    if (cs.identity) {
      identity = `&identity=${encodeURIComponent(cs.identity)}`
    }

    function replaceMsgID(match, id, offset, string) {
      let eid = encodeURIComponent(`%${id}`)

      return `<a class="link link-accent thread-link" href="?pkg=hub&view=thread&thread=${eid}${identity}`
    }

    function replaceChannel(match, id, offset, string) {
      let eid = encodeURIComponent(id)

      return `<a class="link link-accent channel-link" href="?pkg=hub&view=channel&channel=${eid}${identity}`
    }

    function replaceLinks(match, link, offset, string) {
      return `<a class="link" target="_blank" href="${link}`
    }

    function replaceFeedID(match, id, offset, string) {
      let eid = encodeURIComponent(`@${id}`)
      return (
        // eslint-disable-next-line quotes
        '<a class="link link-accent profile-link" href="?pkg=contacts&view=profile&feed=' + eid + identity
      )
    }

    function replaceImageLinks(match, id, offset, string) {
      return (
        `<a class="link  link-accent image-link" target="_blank" href="${patchfox.httpUrl(
          "/blobs/get/&"
        )}` + encodeURIComponent(id)
      )
    }

    function replaceImages(match, id, offset, string) {
      return (
        `<img class="is-image-from-blob" src="${patchfox.httpUrl(
          "/blobs/get/&"
        )}` + encodeURIComponent(id)
      )
    }

    function replaceVideos(match, id, offset, string) {
      return (
        `<video controls class="is-video-from-blob" src="${patchfox.httpUrl(
          "/blobs/get/&"
        )}` + encodeURIComponent(id)
      )
    }

    function replaceAudios(match, id, offset, string) {
      return (
        `<audio controls class="is-audio-from-blob" src="${patchfox.httpUrl(
          "/blobs/get/&"
        )}` + encodeURIComponent(id)
      )
    }

    let opts = {
      toUrl: (ref) => {
        return ref
      },
    }
    let html = ssbMarkdown.block(text, opts)
    html = html
      .replace(/<pre>/gi, `<pre class="code">`)
      .replace(/<a href="#([^"]*)/gi, replaceChannel)
      .replace(/<a href="@([^"]*)/gi, replaceFeedID)
      .replace(/target="_blank"/gi, "")
      .replace(/<a href="%([^"]*)/gi, replaceMsgID)
      .replace(/<img src="&([^"]*)/gi, replaceImages)
      .replace(/<video controls src="&([^"]*)/gi, replaceVideos)
      .replace(/<audio controls src="&([^"]*)/gi, replaceAudios)
      .replace(/<a href="&([^"]*)/gi, replaceImageLinks)
      .replace(/<a href="([^"]*)/gi, replaceLinks)

    if (removePara) {
      html = html
        .replace(/<p>/gi,"")
        .replace(/<\/p>/gi,"")
    }

    return html
  }

  getTimestamp(msg) {
    const arrivalTimestamp = msg.timestamp
    const declaredTimestamp = msg.value.timestamp
    return Math.min(arrivalTimestamp, declaredTimestamp)
  }

  getRootMsgId(msg) {
    if (msg && msg.value && msg.value.content) {
      const root = msg.value.content.root
      if (ssbRef.isMsgId(root)) {
        return root
      }
    }
  }

  setProfileMetadata(data) {
    return new Promise((resolve, reject) => {
      let msgToPost = { type: "about", about: sbot.id }

      Object.assign(msgToPost, data)

      if (sbot) {
        sbot.publish(msgToPost, function (err, msg) {
          if (err) {
            reject(err)
          } else {
            resolve(msg)
          }
        })
      } else {
        reject("There is no sbot connection")
      }
    })
  }

  newPost(data) {
    return new Promise((resolve, reject) => {
      let msgToPost = { type: "post", text: data.text }

      const commonFields = [
        "root",
        "branch",
        "channel",
        "fork",
        "contentWarning",
      ]

      commonFields.forEach((f) => {
        if (
          typeof data[f] !== "undefined" &&
          data[f] !== false &&
          data[f] !== null &&
          data[f].length > 0
        ) {
          msgToPost[f] = data[f]
        }
      })

      msgToPost.mentions = ssbMentions(msgToPost.text) || []

      if (msgToPost.contentWarning && msgToPost.contentWarning.length > 0) {
        let moreMentions = ssbMentions(msgToPost.contentWarning)
        msgToPost.mentions = msgToPost.mentions.concat(moreMentions)
      }

      msgToPost.mentions = msgToPost.mentions.filter((n) => n) // prevent null elements...

      if (sbot) {
        sbot.publish(msgToPost, function (err, msg) {
          if (err) {
            reject(err)
          } else {
            resolve(msg)
          }
        })
      } else {
        reject("There is no sbot connection")
      }
    })
  }
  
  newPrivatePost(data) {
    return new Promise((resolve, reject) => {
      let msgToPost = { type: "post", text: data.text }
  
      const commonFields = [
        "root",
        "branch",
        "channel",
        "fork",
        "contentWarning"
      ]
      
      if (!data.hasOwnProperty("recps")) {
        reject("err: missing recipients for private message.")
        return false
      }
      
      if (!Array.isArray(data.recps) || data.recps.length < 1) {
        reject("err: malformed recipients for private message.")
        return false
      }
  
      commonFields.forEach((f) => {
        if (
          typeof data[f] !== "undefined" &&
          data[f] !== false &&
          data[f] !== null &&
          data[f].length > 0
        ) {
          msgToPost[f] = data[f]
        }
      })
  
      msgToPost.recps = data.recps || [sbot.id]
      msgToPost.mentions = ssbMentions(msgToPost.text) || []
      
      msgToPost.mentions.forEach(m => {
        msgToPost.recps.push(m.link)
      })  
      
      if (msgToPost.contentWarning && msgToPost.contentWarning.length > 0) {
        let moreMentions = ssbMentions(msgToPost.contentWarning)
        msgToPost.mentions = msgToPost.mentions.concat(moreMentions)
      }
  
      msgToPost.mentions = msgToPost.mentions.filter((n) => n) // prevent null elements...
      
      msgToPost.recps = msgToPost.recps.filter((n) => n) // prevent null elements...

  
      if (sbot) {
        sbot.publish(msgToPost, function (err, msg) {
          if (err) {
            reject(err)
          } else {
            resolve(msg)
          }
        })
      } else {
        reject("There is no sbot connection")
      }
    })
  }

  newBlogPost(data) {
    return new Promise((resolve, reject) => {
      let msgToPost = { type: "blog" }
      let blogContent = data.content

      const commonFields = [
        "channel",
        "contentWarning",
        "thumbnail",
        "title",
        "summary",
      ]

      commonFields.forEach((f) => {
        if (
          typeof data[f] !== "undefined" &&
          data[f] !== null &&
          data[f] !== false &&
          data[f].length > 0
        ) {
          msgToPost[f] = data[f]
        }
      })

      msgToPost.mentions = ssbMentions(blogContent) || []

      if (msgToPost.contentWarning && msgToPost.contentWarning.length > 0) {
        let moreMentions = ssbMentions(msgToPost.contentWarning)
        msgToPost.mentions = msgToPost.mentions.concat(moreMentions)
      }

      msgToPost.mentions = msgToPost.mentions.filter((n) => n) // prevent null elements...

      if (sbot) {
        pull(
          pull.values([blogContent]),
          sbot.blobs.add(function (err, hash) {
            // 'hash' is the hash-id of the blob
            if (err) {
              reject("could not create blog post blob: " + err)
            } else {
              msgToPost.blog = hash

              sbot.publish(msgToPost, function (err, msg) {
                if (err) {
                  reject(err)
                } else {
                  resolve(msg)
                }
              })
            }
          })
        )
      } else {
        reject("There is no sbot connection")
      }
    })
  }

  publish(data) {
    return new Promise((resolve, reject) => {
      if (sbot) {
        sbot.publish(data, function (err, msg) {
          if (err) {
            reject(err)
          } else {
            resolve(msg)
          }
        })
      } else {
        reject("There is no sbot connection")
      }
    })
  }

  getBlob(blobid) {
    return new Promise((resolve, reject) => {
      sbot.blobs.want(blobid, function (err) {
        if (err) {
          reject(err)
        } else {
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

  // this is the old votes implementation.
  // I'm going to try to remove it later.
  votesOld(msgid) {
    return new Promise((resolve, reject) => {
      if (sbot) {
        pull(
          sbot.links({ dest: msgid, rel: "vote", values: true }),
          pull.collect((err, msgs) => {
            if (err) {
              reject(err)
            } else {
              resolve(msgs)
            }
          })
        )
      }
    })
  }

  like(msgid) {
    return new Promise((resolve, reject) => {
      const msgToPost = {
        type: "vote",
        vote: {
          link: msgid,
          value: 1,
          expression: "💖",
        },
      }

      if (sbot) {
        sbot.publish(msgToPost, function (err, msg) {
          if (err) {
            reject(err)
          } else {
            resolve(msg)
          }
        })
      }
    })
  }

  unlike(msgid) {
    return new Promise((resolve, reject) => {
      const msgToPost = {
        type: "vote",
        vote: {
          link: msgid,
          value: 0,
          expression: "Unlike",
        },
      }

      if (sbot) {
        sbot.publish(msgToPost, function (err, msg) {
          if (err) {
            reject(err)
          } else {
            resolve(msg)
          }
        })
      }
    })
  }

  channels() {
    return new Promise((resolve, reject) => {
      if (sbot) {
        pull(
          sbot.query.read({
            query: [
              {
                $filter: {
                  value: {
                    content: { channel: { $is: "string" }, type: "post" },
                  },
                },
              },
              {
                $reduce: {
                  channel: ["value", "content", "channel"],
                  count: { $count: true },
                  timestamp: { $max: ["value", "timestamp"] },
                },
              },
              { $sort: [["timestamp"], ["count"]] },
            ],
            limit: 20,
          }),
          pull.collect(function (err, data) {
            if (err) {
              reject(err)
            } else {
              resolve(data)
            }
          })
        )
      } else {
        reject("no sbot")
      }
    })
  }

  channel(channel, opts) {
    return new Promise((resolve, reject) => {
      const pipeline = pipelines.thread.get()

      let query = {
        $filter: {
          value: {
            content: { channel },
          },
        },
        $sort: [["value", "timestamp"]],
      }

      if (opts.lt) {
        query.$filter.value.timestamp = { $lt: opts.lt }
      }

      if (sbot) {
        pull(
          sbot.query.read({
            query: [query],
            reverse: true,
          }),
          // TODO: generalize this into a new pluggable filter.
          pull.filter((msg) => {
            let res = true
            if (opts.rootsOnly) {
              if (msg && msg.value && msg.value.content) {
                let m = msg.value.content

                // root, branch, fork need to be null
                if (typeof m.root !== "undefined" && m.root !== null) {
                  res = false
                }

                if (typeof m.branch !== "undefined" && m.branch !== null) {
                  res = false
                }

                if (typeof m.fork !== "undefined" && m.fork !== null) {
                  res = false
                }
              }
            }
            return res
          }),
          pull.apply(pull, pipeline),
          pull.collect(function (err, data) {
            if (err) {
              reject(err)
            } else {
              resolve(data)
            }
          })
        )
      } else {
        reject("no sbot")
      }
    })
  }

  channelSubscribe(channel) {
    return new Promise((resolve, reject) => {
      const msgToPost = {
        type: "channel",
        channel: channel,
        subscribed: true,
      }

      if (sbot) {
        sbot.publish(msgToPost, function (err, msg) {
          if (err) {
            reject(err)
          } else {
            resolve(msg)
          }
        })
      }
    })
  }

  channelUnsubscribe(channel) {
    return new Promise((resolve, reject) => {
      const msgToPost = {
        type: "channel",
        channel: channel,
        subscribed: false,
      }

      if (sbot) {
        sbot.publish(msgToPost, function (err, msg) {
          if (err) {
            reject(err)
          } else {
            resolve(msg)
          }
        })
      }
    })
  }

  channelSubscribed(channel, feed) {
    return new Promise((resolve, reject) => {
      if (sbot) {
        if (!feed) {
          feed = sbot.id
        }

        let query = {
          $filter: {
            value: {
              author: feed,
              content: {
                type: "channel",
                channel,
              },
            },
          },
        }

        pull(
          sbot.query.read({
            query: [query],
            reverse: true,
          }),
          pull.collect(function (err, data) {
            if (err) {
              reject(err)
            } else {
              if (data.length > 0) {
                resolve(data[0].value.content.subscribed || false)
              } else {
                resolve(false)
              }
            }
          })
        )
      } else {
        reject("no sbot")
      }
    })
  }

  subscribedChannels(channel, feed) {
    return new Promise((resolve, reject) => {
      if (sbot) {
        if (!feed) {
          feed = sbot.id
        }

        let query = {
          $filter: {
            value: {
              author: feed,
              content: {
                type: "channel",
              },
            },
          },
          $map: {
            channel: ["value", "content", "channel"],
            subscribed: ["value", "content", "subscribed"],
          },
          $sort: [["value", "timestamp"]],
        }

        pull(
          sbot.query.read({
            query: [query],
            reverse: true,
          }),
          pull.collect(function (err, data) {
            if (err) {
              reject(err)
            } else {
              resolve(data)
            }
          })
        )
      } else {
        reject("no sbot")
      }
    })
  }

  follow(feed) {
    return new Promise((resolve, reject) => {
      const msgToPost = {
        type: "contact",
        contact: feed,
        following: true,
      }

      if (sbot) {
        sbot.publish(msgToPost, function (err, msg) {
          if (err) {
            reject(err)
          } else {
            resolve(msg)
          }
        })
      }
    })
  }

  unfollow(feed) {
    return new Promise((resolve, reject) => {
      const msgToPost = {
        type: "contact",
        contact: feed,
        following: false,
      }

      if (sbot) {
        sbot.publish(msgToPost, function (err, msg) {
          if (err) {
            reject(err)
          } else {
            resolve(msg)
          }
        })
      }
    })
  }

  block(feed) {
    return new Promise((resolve, reject) => {
      const msgToPost = {
        type: "contact",
        contact: feed,
        blocking: true,
      }

      if (sbot) {
        sbot.publish(msgToPost, function (err, msg) {
          if (err) {
            reject(err)
          } else {
            resolve(msg)
          }
        })
      }
    })
  }

  unblock(feed) {
    return new Promise((resolve, reject) => {
      const msgToPost = {
        type: "contact",
        contact: feed,
        blocking: false,
      }

      if (sbot) {
        sbot.publish(msgToPost, function (err, msg) {
          if (err) {
            reject(err)
          } else {
            resolve(msg)
          }
        })
      }
    })
  }

  following(feed, byWhom) {
    return new Promise((resolve, reject) => {
      if (sbot) {
        if (!byWhom) {
          byWhom = sbot.id
        }

        let query = {
          $filter: {
            value: {
              author: byWhom,
              content: {
                type: "contact",
                contact: feed,
                following: { $is: "boolean" },
              },
            },
          },
        }

        pull(
          sbot.query.read({
            query: [query],
            reverse: true,
          }),
          pull.collect(function (err, data) {
            if (err) {
              reject(err)
            } else {
              if (data.length > 0) {
                resolve(data[0].value.content.following || false)
              } else {
                resolve(false)
              }
            }
          })
        )
      } else {
        reject("no sbot")
      }
    })
  }

  blocking(feed, byWhom) {
    return new Promise((resolve, reject) => {
      if (sbot) {
        if (!byWhom) {
          byWhom = sbot.id
        }

        let query = {
          $filter: {
            value: {
              author: byWhom,
              content: {
                type: "contact",
                contact: feed,
                blocking: { $is: "boolean" },
              },
            },
          },
        }

        pull(
          sbot.query.read({
            query: [query],
            reverse: true,
          }),
          pull.collect(function (err, data) {
            if (err) {
              reject(err)
            } else {
              if (data.length > 0) {
                resolve(data[0].value.content.blocking || false)
              } else {
                resolve(false)
              }
            }
          })
        )
      } else {
        reject("no sbot")
      }
    })
  }

  query(filter, reverse, map, reduce) {
    return new Promise((resolve, reject) => {
      if (sbot) {
        const pipeline = pipelines.thread.get()

        let query = {
          $filter: filter,
        }

        if (map) {
          query.$map = map
        }

        if (reduce) {
          query.$reduce = reduce
        }

        if (typeof reverse == "undefined") {
          reverse = true
        }

        pull(
          sbot.query.read({
            query: [query],
            reverse: reverse,
          }),
          pull.apply(pull, pipeline),
          pull.collect((err, data) => {
            if (err) {
              reject(err)
            } else {
              resolve(data)
            }
          })
        )
      } else {
        reject("no sbot")
      }
    })
  }

  friendship(source, dest) {
    return new Promise((resolve, reject) => {
      if (sbot) {
        let query = {
          $filter: {
            value: {
              author: source,
              content: {
                type: "contact",
              },
            },
          },
        }

        pull(
          sbot.query.read({
            query: [query],
          }),
          pull.collect((err, data) => {
            if (err) {
              reject(err)
            } else {
              resolve(data)
            }
          })
        )
      } else {
        reject("no sbot")
      }
    })
  }

  /**
   * Below this is all a part of the great Oasis heist.
   *
   * Oasis is another client for SSB, it is fucking awesome.
   * You can get more info about it on:
   *
   * http://github.com/fraction/oasis
   *
   * Anyway, Oasis has some great features which our little webby
   * foxes want, so we're stealing them. At the moment our loot contains:
   *
   * - the popular view.
   * - transform
   *
   * PS: Those routines are being adapted to Patchfox and differ from
   * their original source.
   */

  async popular({ period, page = 1 }) {
    if (!sbot) {
      throw "error: no sbot"
    }

    const transform = this.transform.bind(this)

    const pipeline = pipelines.message.get()

    const periodDict = {
      day: 1,
      week: 7,
      month: 30.42,
      year: 365,
    }

    if (period in periodDict === false) {
      throw new Error("invalid period")
    }

    const myFeedId = sbot.id

    const now = new Date()
    const earliest = Number(now) - 1000 * 60 * 60 * 24 * periodDict[period]

    const source = sbot.query.read(
      configure({
        query: [
          {
            $filter: {
              value: {
                timestamp: { $gte: earliest },
                content: {
                  type: "vote",
                },
              },
              timestamp: { $gte: earliest },
            },
          },
        ],
        index: "DTA",
      })
    )
    const followingFilter = await this.socialFilter({ following: true })

    const messages = await new Promise((resolve, reject) => {
      pull(
        source,
        // this.filterPublicOnly, // <-- filter declared on top with other filters
        pull.filter((msg) => {
          return (
            typeof msg.value.content === "object" &&
            typeof msg.value.content.vote === "object" &&
            typeof msg.value.content.vote.link === "string" &&
            typeof msg.value.content.vote.value === "number"
          )
        }),
        pull.reduce(
          (acc, cur) => {
            const author = cur.value.author
            const target = cur.value.content.vote.link
            const value = cur.value.content.vote.value

            if (acc[author] == null) {
              acc[author] = {}
            }

            // Only accept values between -1 and 1
            acc[author][target] = Math.max(-1, Math.min(1, value))

            return acc
          },
          {},
          (err, obj) => {
            if (err) {
              return reject(err)
            }

            // HACK: Can we do this without a reduce()? I think this makes the
            // stream much slower than it needs to be. Also, we should probably
            // be indexing these rather than building the stream on refresh.

            const adjustedObj = Object.entries(obj).reduce(
              (acc, [author, values]) => {
                if (author === myFeedId) {
                  return acc
                }

                const entries = Object.entries(values)
                const total = 1 + Math.log(entries.length)

                entries.forEach(([link, value]) => {
                  if (acc[link] == null) {
                    acc[link] = 0
                  }
                  acc[link] += value / total
                })
                return acc
              },
              []
            )

            const arr = Object.entries(adjustedObj)
            const length = arr.length
            const maxMessages = Number(getPref("limit", 10)) * page

            pull(
              pull.values(arr),
              pullSort(([, aVal], [, bVal]) => bVal - aVal),
              pull.take(Math.min(length, maxMessages)),
              pull.map(([key]) => key),
              pullParallelMap(async (key, cb) => {
                const msg = await this.get(key)
                const data = { key: key, value: msg }
                cb(null, data)
              }),
              followingFilter,
              pull.apply(pull, pipeline),
              pull.collect((err, collectedMessages) => {
                if (err) {
                  reject(err)
                } else {
                  resolve(
                    collectedMessages.slice(Number(getPref("limit", 10) * -1))
                  )
                }
              })
            )
          }
        )
      )
    })

    return messages
  }

  /**
   * Returns a function that filters messages based on who published the message.
   *
   * `null` means we don't care, `true` means it must be true, and `false` means
   * that the value must be false. For example, if you set `me = true` then it
   * will only allow messages that are from you. If you set `blocking = true`
   * then you only see message from people you block.
   */
  async socialFilter({ following = null, blocking = false, me = null } = {}) {
    if (!sbot) {
      throw "error: no sbot"
    }

    const { id } = sbot
    const relationshipObject = await sbot.friends.get({
      source: id,
    })

    const followingList = Object.entries(relationshipObject)
      .filter(([, val]) => val === true)
      .map(([key]) => key)

    const blockingList = Object.entries(relationshipObject)
      .filter(([, val]) => val === false)
      .map(([key]) => key)

    return pull.filter((message) => {
      if (message.value.author === id) {
        return me !== false
      } else {
        return (
          (following === null ||
            followingList.includes(message.value.author) === following) &&
          (blocking === null ||
            blockingList.includes(message.value.author) === blocking)
        )
      }
    })
  }

  votes(msg) {
    return new Promise((resolve, reject) => {
      if (!msg.key && typeof msg == "string") {
        msg = { key: msg }
      }

      let cachedResult = resultFromCache("votes", msg.key, 10)

      if (cachedResult) {
        return cachedResult
      }

      const voteQuery = async (msg) => {
        const filterQuery = {
          $filter: {
            dest: msg.key,
            value: {
              content: {
                type: "vote",
              },
            },
          },
        }

        const referenceStream = ssb.sbot.backlinks.read({
          query: [filterQuery],
          index: "DTA", // use asserted timestamps
          private: true,
          meta: true,
        })

        let rawVotes

        try {
          rawVotes = await new Promise((resolve, reject) => {
            pull(
              referenceStream,
              pull.filter(
                (ref) =>
                  typeof ref.value.content.vote.value === "number" &&
                  ref.value.content.vote.value >= 0 &&
                  ref.value.content.vote.link === msg.key
              ),
              pull.collect((err, collectedMessages) => {
                if (err) {
                  console.error("err", err)
                  reject(err)
                } else {
                  resolve(collectedMessages)
                }
              })
            )
          })
        } catch (n) {
          console.error("error with rawVotes", n)
          throw n
        }

        // { @key: 1, @key2: 0, @key3: 1 }
        //
        // only one vote per person!
        const reducedVotes = rawVotes.reduce((acc, vote) => {
          acc[vote.value.author] = vote.value.content.vote.value
          return acc
        }, {})

        // gets *only* the people who voted 1
        // [ @key, @key, @key ]
        const voters = Object.entries(reducedVotes)
          .filter(([, value]) => value === 1)
          .map(([key]) => key)

        return voters
      }

      enqueue(
        "votes",
        msg.key,
        10,
        async function work() {
          let res = await voteQuery(msg)
          return res
        },
        function callback(votes) {
          resolve(votes)
        }
      )
    })
  }

  transform() {
    console.log("transform...")
    const aux = async (msg) => {
      if (msg == null) {
        return msg
      }

      const filterQuery = {
        $filter: {
          dest: msg.key,
        },
      }

      const referenceStream = ssb.sbot.backlinks.read({
        query: [filterQuery],
        index: "DTA", // use asserted timestamps
        private: true,
        meta: true,
      })

      let rawVotes

      try {
        rawVotes = await new Promise((resolve, reject) => {
          pull(
            referenceStream,
            pull.filter(
              (ref) =>
                typeof ref.value.content !== "string" &&
                ref.value.content.type === "vote" &&
                ref.value.content.vote &&
                typeof ref.value.content.vote.value === "number" &&
                ref.value.content.vote.value >= 0 &&
                ref.value.content.vote.link === msg.key
            ),
            pull.collect((err, collectedMessages) => {
              if (err) {
                console.error("err", err)
                reject(err)
              } else {
                resolve(collectedMessages)
              }
            })
          )
        })
      } catch (n) {
        console.error("error with rawVotes", n)
        throw n
      }

      // { @key: 1, @key2: 0, @key3: 1 }
      //
      // only one vote per person!
      const reducedVotes = rawVotes.reduce((acc, vote) => {
        acc[vote.value.author] = vote.value.content.vote.value
        return acc
      }, {})

      // gets *only* the people who voted 1
      // [ @key, @key, @key ]
      const voters = Object.entries(reducedVotes)
        .filter(([, value]) => value === 1)
        .map(([key]) => key)

      const isPost =
        _.get(msg, "value.content.type") === "post" &&
        _.get(msg, "value.content.text") != null
      const hasRoot = _.get(msg, "value.content.root") != null
      const hasFork = _.get(msg, "value.content.fork") != null

      if (isPost && hasRoot === false && hasFork === false) {
        _.set(msg, "value.meta.postType", "post")
      } else if (isPost && hasRoot && hasFork === false) {
        _.set(msg, "value.meta.postType", "comment")
      } else if (isPost && hasRoot && hasFork) {
        _.set(msg, "value.meta.postType", "reply")
      } else {
        _.set(msg, "value.meta.postType", "mystery")
      }

      _.set(msg, "value.meta.votes", voters)
      _.set(msg, "value.meta.voted", voters.includes(ssb.sbot.id))

      return msg
    }

    return pullParallelMap((msg, cb) => {
      aux(msg)
        .then((data) => cb(null, data))
        .catch((err) => cb(err, null))
    })
  }
}

module.exports.NodeJsSSB = NodeJsSSB
