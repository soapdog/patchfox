// noinspection DuplicatedCode

/**
 * NodeJS DB1 SSB
 *
 * Things I don't currently like here:
 * - usage of getPref and abuse prevention. This should be pluggable!
 *
 * This file is fucking big and needs to be refactored.
 */

const pull = require("pull-stream")
const sort = require("ssb-sort")
const ssbMarkdown = require("ssb-markdown")
const ssbRef = require("ssb-ref")
const ssbMentions = require("ssb-mentions")
const ssbClient = require("ssb-client")
const ssbAvatar = require("ssb-avatar")
const pullParallelMap = require("pull-paramap")
const pullSort = require("pull-sort")
const Abortable = require("pull-abortable")
const _ = require("lodash")
const ssbHttpInviteClient = require("ssb-http-invite-client")
const fileReader = require("pull-file-reader")
const queryString = require("query-string")
const rooms2 = require("./rooms2.js")
const system = require("./system.js")
const friendship = require("./friendship.js")
const pipelines = require("../common/pipelines.js")
const { enqueue } = require("../common/queues.js")
const { resultFromCache, getMsgCache, setMsgCache, setAvatarCache, getCachedAvatar, getAllCachedUsers, loadCaches } = require("../common/cache.js")
const {
  setSharedFunctionsForFilters,
  filterTypes,
  filterLimit,
  filterRemovePrivateMsgs,
  filterBlocking,
  filterWithUserFilters,
  filterHasContent,
  updateFriendsAndFollowing
} = require("../common/filters.js")

let sbot = false
let getPref = () => false
let isMessageHidden = () => false

/**
 * NodeJS SSB Server compatible implementation of high-level SSB API for Patchfox.
 */
class NodeJsDB1 {
  constructor() {
    this.platform = "nodejs-db1"

    // add basic built-in pipelines
    pipelines.thread.use(filterHasContent)
    pipelines.thread.use(filterTypes)
    pipelines.thread.use(filterRemovePrivateMsgs)
    pipelines.thread.use(filterWithUserFilters)
    pipelines.thread.use(filterLimit)

    pipelines.message.use(filterHasContent)
    // pipelines.message.use(filterTypes)
    pipelines.message.use(filterRemovePrivateMsgs)
    pipelines.message.use(filterWithUserFilters)

    // imported MUXRPC
    this.rooms2 = rooms2
    this.system = system
    this.friendship = friendship

    // merging from common
    // TODO: automate this with auxiliary function in commons.
    this.loadCaches = loadCaches
    this.resultFromCache = resultFromCache
    this.getMsgCache = getMsgCache
    this.setMsgCache = setMsgCache
    this.setAvatarCache = setAvatarCache
    this.getCachedAvatar = getCachedAvatar
    this.getAllCachedUsers = getAllCachedUsers
    this.filterWithUserFilters = filterWithUserFilters
  }

  log(pMsg, pVal = "") {
    console.log(`[SSB API] - ${pMsg}`, pVal)
  }

  setGetPrefFunction(gp) {
    getPref = gp
  }

  setIsMessageHiddenFunction(ish) {
    isMessageHidden = ish

    // this is called after `setGetPrefFunction()`.
    // Use it to pass those values to the filters.
    // Yes, I agree this is a bad pattern and stupid.

    setSharedFunctionsForFilters({
      getPref,
      isMessageHidden,
    })
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
        console.log("remote", remote)
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
              reject(err.message)
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
              sbot.close.hook = data => {
                console.warn("sbot.close is a no-op polyfill, doesn't actually work.")
              }

              console.log("you are", server.id)
              resolve(server)
            }
          }
        )
      }
    })
  }

  async public(opts) {
    opts = opts || {}
    opts.reverse = opts.reverse || true

    const pipeline = pipelines.thread.get()
    const filter = opts.filter
    let selectedFilter
    // console.time("Getting friends graph")
    let friends = await friendship.friendsAsArray(sbot.id)
    // console.timeEnd("Getting friends graph")
    // console.time("Getting following graph")
    let following = await friendship.followingAsArray(sbot.id)
    // console.timeEnd("Getting following graph")
    
    // console.log("friends", friends)
    // console.log("following", following)

    // so you don't filter yourself out.
    friends.push(sbot.id)
    following.push(sbot.id)

    updateFriendsAndFollowing(friends, following)

    // switch (filter) {
    // case "Following":
    //   selectedFilter = pull.filter(m => following.includes(m.value.author))
    //   break
    // case "Friends":
    //   selectedFilter = pull.filter(m => friends.includes(m.value.author))
    //   break
    // default:
    //   selectedFilter = null
    //   break
    // }

    delete opts.filter

    const messages = new Promise((resolve, reject) => {
      pull(
        sbot.createFeedStream(opts),
        // selectedFilter,
        pull.apply(pull, pipeline),
        // pullParallelMap((m, cb) => {
        //   this.extendMessageWithRootMessageFor(m)
        //     .then(messageWithRoot => {
        //       cb(null, messageWithRoot)
        //     })
        // }, 5),
        pull.collect((err, msgs) => {
          if (err) {
            reject(err)
          }

          resolve(msgs)
        })
      )
    })

    return messages
  }

  thread(id) {
    return new Promise((resolve, reject) => {
      const pipeline = pipelines.message.get()

      sbot.get({id, meta: true}, (err, msg) => {
        if (err) {
          return reject(err)
        }

        const rootKey = this.getRoot(msg)

        if (rootKey !== id) {
          this.thread(rootKey)
            .then(ms => resolve(ms))
            .catch(e => reject(e))

          return
        }

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
            : pull(sbot.links({ dest: id, values: true, rel: "root" }), pull.unique("key")),
          pull.apply(pull, pipeline),
          pull.collect((err, msgs) => {
            if (err) reject(err)
            resolve(sort([msg].concat(msgs)))
          })
        )
      })
    })
  }

  mentions(feed, lt) {
    return new Promise((resolve, reject) => {
      const pipeline = pipelines.thread.get()

      const createBacklinkStream = id => {
        let filterQuery = {
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

  search(query, lt) {
    return new Promise((resolve, reject) => {
      const pipeline = pipelines.thread.get()

      let q = query.toLowerCase()
      let limit = parseInt(getPref("limit", 10))
      pull(
        pull(sbot => sbot.search.query({ q, limit })),
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
    const abortable = Abortable()
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
      cb({ msg: null }, abortable) // just so that the caller has a copy from abortable from the start
      if (sbot) {
        const pipeline = pipelines.thread.get()

        try {
          let q = query.toLowerCase()
          pull(
            sbot.createLogStream(opts),
            abortable,
            pull.filter(matchesQuery),
            pull.apply(pull, pipeline),
            pull.drain(
              msg => {
                if (!msg.sync) {
                  cb({ msg, abortable })
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

  profile(feedid) {
    return new Promise((resolve, reject) => {
      let opts = {
        id: feedid,
        reverse: true,
      }

      let user = {
        msgs: [],
        about: {},
      }

      this.aboutMessages(feedid, feedid).then(data => {
        user.about = data

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
    })
  }

  getRoot (msg) {
    // from: Patchwork.
    // URL: https://github.com/ssbc/patchwork/blob/master/lib/get-root.js
    //
    // This doesn't fetch the "root message" of a given message, it just
    // returns the "root key" associated with a given message.
    if (msg && msg.value && msg.value.content) {
      const type = msg.value.content.type
      let root = msg.value.content.root

      if (type === "vote") {
        root = msg.value.content.vote && msg.value.content.vote.link
      } else if (type === "about") {
        root = msg.value.content.about
      }

      if (ssbRef.isMsg(root)) {
        return root
      } else {
        return msg.key
      }
    }
  }

  extendMessageWithRootMessageFor(msg) {
    return new Promise((resolve, reject) => {
      let id = msg.key
      let root = this.getRoot(msg)

      if (msg.hasOwnProperty("extra")) {
        console.log("circular root found in msg:", id)
        resolve(msg)
      }

      msg.extra = {}

      if (root == id) {
        setMsgCache(id, msg)
        msg.extra.isRoot = true
        resolve(msg)
      } else {
        msg.extra.isRoot = false
        sbot.get({id: root, meta: true}, (err, m) => {
          if (err) {
            reject(err)
          } else {
            msg.extra.rootMsg = m
            resolve(msg)
          }
        })
      }
    })
  }

  get(id) {
    return new Promise((resolve, reject) => {
      if (getMsgCache(id)) {
        resolve(getMsgCache(id))
      }
      if (sbot.ooo) {
        sbot.get({ id: id, raw: true, ooo: false, private: true }, (err, data) => {
          if (err) {
            reject(err)
          }
          
          resolve(data)
          
        })
      } else if (!sbot.private) {
        // if no sbot.private, assume we have newer sbot that supports private:true
        return sbot.get({ id: id, private: true }, (err, data) => {
          if (err) {
            reject(err)
          }
          
          resolve(data)
          
        })
      } else {
        sbot.get(id, (err, data) => {
          if (err) {
            reject(err)
          }
          
          resolve(data)
          
        })
      }
    })
  }

  addBlob(file) {
    return new Promise((resolve, reject) => {
      pull(
        fileReader(file),
        sbot.blobs.add(function (err, hash) {
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

  avatar(feed) {
    return new Promise((resolve, reject) => {
      ssbAvatar(sbot, sbot.id, feed, function (err, data) {
        if (err) {
          reject(err)
        } else if (data) {
          setAvatarCache(feed, data)
          resolve(data)
        } else {
          reject("unknown error")
        }
      })
    })
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

      if ((data ?? null) !== null) {
        retVal = `Patchfox error: message ${msgid} is null`
      }

      if (data?.value && data.value.content.type == "post") {
        retVal = this.plainTextFromMarkdown(data.value.content.text).slice(0, howManyChars) + "..."
      }

      if (data?.content && data.content.type == "post") {
        retVal = this.plainTextFromMarkdown(data.content.text).slice(0, howManyChars) + "..."
      }

      return retVal
    } catch (n) {
      console.log("data", data)
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
        `<a class="link link-accent profile-link" href="?pkg=contacts&view=profile&feed=` + eid + identity
      )
    }

    function replaceImageLinks(match, id, offset, string) {
      return `<a class="link  link-accent image-link" target="_blank" href="${patchfox.httpUrl("/blobs/get/&")}` + id
    }

    function replaceImages(match, id, offset, string) {
      return `<img class="is-image-from-blob" src="${patchfox.httpUrl("/blobs/get/&")}` + id
    }

    function replaceVideos(match, id, offset, string) {
      return `<video controls class="is-video-from-blob" src="${patchfox.httpUrl("/blobs/get/&")}` + id
    }

    function replaceAudios(match, id, offset, string) {
      return `<audio controls class="is-audio-from-blob" src="${patchfox.httpUrl("/blobs/get/&")}` + id
    }

    let opts = {
      toUrl: ref => {
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
      .replace(/<video src="&([^"]*)/gi, replaceVideos)
      .replace(/<audio src="&([^"]*)/gi, replaceAudios)
      .replace(/<a href="&([^"]*)/gi, replaceImageLinks)
      .replace(/<a href="([^"]*)/gi, replaceLinks)

    if (removePara) {
      html = html.replace(/<p>/gi, "").replace(/<\/p>/gi, "")
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

      const commonFields = ["root", "branch", "channel", "fork", "contentWarning"]

      commonFields.forEach(f => {
        if (typeof data[f] !== "undefined" && data[f] !== false && data[f] !== null && data[f].length > 0) {
          msgToPost[f] = data[f]
        }
      })

      msgToPost.mentions = ssbMentions(msgToPost.text) || []

      if (msgToPost.contentWarning && msgToPost.contentWarning.length > 0) {
        let moreMentions = ssbMentions(msgToPost.contentWarning)
        msgToPost.mentions = msgToPost.mentions.concat(moreMentions)
      }

      msgToPost.mentions = msgToPost.mentions.filter(n => n) // prevent null elements...

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

      const commonFields = ["channel", "contentWarning", "thumbnail", "title", "summary"]

      commonFields.forEach(f => {
        if (typeof data[f] !== "undefined" && data[f] !== null && data[f] !== false && data[f].length > 0) {
          msgToPost[f] = data[f]
        }
      })

      msgToPost.mentions = ssbMentions(blogContent) || []

      if (msgToPost.contentWarning && msgToPost.contentWarning.length > 0) {
        let moreMentions = ssbMentions(msgToPost.contentWarning)
        msgToPost.mentions = msgToPost.mentions.concat(moreMentions)
      }

      msgToPost.mentions = msgToPost.mentions.filter(n => n) // prevent null elements...

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
          pull.filter(msg => {
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

    if (!(period in periodDict)) {
      throw new Error("invalid period")
    }

    const myFeedId = sbot.id
    const now = new Date()
    const earliest = Number(now) - 1000 * 60 * 60 * 24 * periodDict[period]

    const defaultOptions = {
      private: true,
      reverse: true,
      meta: true,
    }

    const configure = (...customOptions) => Object.assign({}, defaultOptions, ...customOptions)

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
        pull.filter(msg => {
          return typeof msg.value.content === "object" && typeof msg.value.content.vote === "object" && typeof msg.value.content.vote.link === "string" && typeof msg.value.content.vote.value === "number"
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

            const adjustedObj = Object.entries(obj).reduce((acc, [author, values]) => {
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
            }, [])

            const arr = Object.entries(adjustedObj)
            const length = arr.length
            const maxMessages = Number(getPref("limit", 10)) * page

            pull(
              pull.values(arr),
              pullSort(([, aVal], [, bVal]) => bVal - aVal),
              pull.take(Math.min(length, maxMessages)),
              pull.map(([key]) => key),
              pullParallelMap(async (key, cb) => {
                try {
                  const msg = await this.get(key)
                  const data = { key: key, value: msg }
                  cb(null, data)
                } catch (n) {
                  // something bad happened.
                  console.log(key)
                  console.error(`error getting msg`, n)
                  cb(null, null)
                }
              }),
              followingFilter,
              pull.apply(pull, pipeline),
              pull.collect((err, collectedMessages) => {
                if (err) {
                  reject(err)
                } else {
                  resolve(collectedMessages.slice(Number(getPref("limit", 10) * -1)))
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
   * Copied from Oasis.
   * URL: https://github.com/planetary-social/oasis/blob/master/src/models.js
   *
   * (The things I steal from oasis...)
   * 
   * NOTE: 
   * - This kinda impacts the speed of the public feed view a lot.
   * 
   * Original comment below:
   * ----------------------------------------------------------------------------
   * 
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
    const relationshipObject = await new Promise((resolve, reject) => {
      sbot.friends.graph((err, graph) => {
        if (err) {
          console.error(err)
          reject(err)
        }
        // console.log("graph", graph)
        resolve(graph[id] || {})
      })
    })
    // console.log("r", relationshipObject)

    const followingList = Object.entries(relationshipObject)
      .filter(([, val]) => val >= 0)
      .map(([key]) => key)

    const blockingList = Object.entries(relationshipObject)
      .filter(([, val]) => val === -1)
      .map(([key]) => key)

    return pull.filter(message => {
      if (!message?.value) {
        return false
      }
      if (message.value.author === id) {
        return me !== false
      } else {
        return (following === null || followingList.includes(message.value.author) === following) && (blocking === null || blockingList.includes(message.value.author) === blocking)
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

      const voteQuery = async msg => {
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
              pull.filter(ref => typeof ref.value.content.vote.value === "number" && ref.value.content.vote.value >= 0 && ref.value.content.vote.link === msg.key),
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

      voteQuery(msg).then(votes => resolve(votes))

      //   enqueue(
      //     "votes",
      //     msg.key,
      //     10,
      //     async function work() {
      //       let res = await voteQuery(msg)
      //       return res
      //     },
      //     function callback(votes) {
      //       resolve(votes)
      //     }
      //   )
    })
  }

  transform() {
    console.log("transform...")
    const aux = async msg => {
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
            pull.filter(ref => typeof ref.value.content !== "string" && ref.value.content.type === "vote" && ref.value.content.vote && typeof ref.value.content.vote.value === "number" && ref.value.content.vote.value >= 0 && ref.value.content.vote.link === msg.key),
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

      const isPost = _.get(msg, "value.content.type") === "post" && _.get(msg, "value.content.text") != null
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
        .then(data => cb(null, data))
        .catch(err => cb(err, null))
    })
  }
}

module.exports.NodeJsDB1 = NodeJsDB1
