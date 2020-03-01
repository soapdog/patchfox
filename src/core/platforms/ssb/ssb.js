/**
 * SSB
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
const ssbClient = require("ssb-client")
const ssbAvatar = require("ssb-avatar")
const pullParallelMap = require("pull-paramap");
const pullSort = require("pull-sort");

const defaultOptions = {
  private: true,
  reverse: true,
  meta: true
};

const pipelines = {
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
};

const configure = (...customOptions) =>
  Object.assign({}, defaultOptions, ...customOptions);


let sbot = false
let getPref = () => false
let isMessageHidden = () => false

let avatarCache = {}

const getMsgCache = (id) => {
  let data = sessionStorage.getItem(id)
  if (data) {
    return JSON.parse(data)
  } else {
    return false
  }
}


const setMsgCache = (id, data) => {
  sessionStorage.setItem(id, JSON.stringify(data))
}


class SSB {
  constructor() {
    // add basic built-in pipelines
    pipelines.thread.use(this.filterHasContent)
    pipelines.thread.use(this.filterTypes)
    pipelines.thread.use(this.filterWithUserFilters)
    pipelines.thread.use(this.filterLimit)
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
    let port = 8989;

    if (!keys) {
      throw "no keys passed to ssb.connect()"
    }
    return new Promise(function (resolve, reject) {
      if (sbot) {
        resolve(sbot)
      } else {
        ssbClient(keys, {
          remote: remote || `ws://127.0.0.1:${port}/~shs:${keys.public}`,
          caps: {
            shs: "1KHLiKZvAvjbY1ziZEHMXawbCEIM6qwjCDm3VYRan/s=",
            sign: null
          }
        }, (err, server) => {
          if (err) {
            reject("can't connect to sbot")
          } else {
            sbot = server
            console.log("you are", server.id)
            resolve(server)
          }
        })
      }
    })
  }

  filterHasContent() {
    return pull.filter(msg => msg && msg.value && msg.value.content)
  }

  filterLimit() {
    let limit = getPref("limit", 10)
    return pull.take(Number(limit))
  }

  filterWithUserFilters() {
    return pull.filter(m => {
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
      "post": "showTypePost",
      "about": "showTypeAbout",
      "vote": "showTypeVote",
      "contact": "showTypeContact",
      "pub": "showTypePub",
      "blog": "showTypeBlog",
      "channel": "showTypeChannel"
    }

    let showUnknown = false

    if (showUnknown) {
      return pull.filter(() => true);
    }

    return pull.filter(msg => {
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

      const pipeline = pipelines.thread.get();

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
      const pipeline = pipelines.thread.get();

      sbot.get(id, (err, value) => {
        if (err) return reject(err)
        var rootMsg = { key: id, value: value }
        pull(
          sbot.backlinks && sbot.backlinks.read ? sbot.backlinks.read({
            query: [
              {
                $filter: {
                  dest: id
                }
              }
            ],
            reverse: true
          }) : pull(
            sbot.links({ dest: id, values: true, rel: 'root' }),
            pull.unique('key')
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
      const pipeline = pipelines.thread.get();

      const createBacklinkStream = id => {
        var filterQuery = {
          $filter: {
            dest: id
          }
        };

        if (lt) {
          filterQuery.$filter.value = { timestamp: { $lt: lt } };
        }

        return sbot.backlinks.read({
          query: [filterQuery],
          index: "DTA", // use asserted timestamps
          reverse: true,
        });
      };

      const uniqueRoots = msg => {
        return pull.filter(msg => {
          let msgKey = msg.key;
          if (msg.value.content.type !== "post") {
            return true;
          }
          let rootKey = msg.value.content.root || false;
          if (rootKey) {
            if (msgs.some(m => m.value.content.root === rootKey)) {
              return false;
            }
          }
          return true;
        });
      };

      const mentionUser = msg => {
        return pull.filter(msg => {
          if (msg.value.content.type !== "post") {
            return true;
          }
          let mentions = msg.value.content.mentions || [];
          if (mentions.some(m => m.link == sbot.id)) {
            return true;
          }
          return false;
        });
      };

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
      );
    })
  }

  search(query, lt) {
    return new Promise((resolve, reject) => {
      const pipeline = pipelines.thread.get();

      let q = query.toLowerCase();
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
      );
    })
  }

  searchWithCallback(query, cb) {
    const matchesQuery = searchFilter(query.split(" "))
    const opts = { reverse: true, live: true, private: true }

    function searchFilter(terms) {
      return function (msg) {
        if (msg.sync) return true
        const c = msg && msg.value && msg.value.content
        return c && (
          msg.key === terms[0] || andSearch(terms.map(function (term) {
            return new RegExp('\\b' + term + '\\b', 'i')
          }), [c.text, c.name, c.title])
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
          let q = query.toLowerCase();
          pull(
            sbot.createLogStream(opts),
            pull.filter(matchesQuery),
            //this.filterTypes(),
            //this.filterWithUserFilters(),
            //this.filterLimit(),
            pull.drain((msg) => {
              if (!msg.sync) {
                cb(msg)
              }
            }, () => resolve())
          );
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
        values: true
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
        reverse: true
      }

      let user = {
        msgs: [],
        about: await this.aboutMessages(feedid, feedid)
      }

      const pipeline = pipelines.thread.get();


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
      if (getMsgCache(id)) {
        resolve(getMsgCache(id))
      }
      if (sbot.ooo) {
        sbot.get({ id: id, raw: true, ooo: false, private: true }, (err, data) => {
          if (err) reject(err)
          setMsgCache(id, data)
          resolve(data)
        })
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

  async setAvatarCache(feed, data) {
    let s = {}
    s[`avatar-${feed}`] = data
    return browser.storage.local.set(s)
  }

  async getCachedAvatar(feed) {
    return browser.storage.local.get(`avatar-${feed}`)
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

    const getAvatarAux = async feed => {
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
    keys.forEach(k => {
      let key = k.replace("profile-", "")
      avatarCache[key] = JSON.parse(allSavedData[k])
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
        retVal = this.plainTextFromMarkdown(data.content.text).slice(0, howManyChars) + "..."
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

  markdown(text) {

    function replaceMsgID(match, id, offset, string) {
      let eid = encodeURIComponent(`%${id}`);

      return `<a class="thread-link" href="?pkg=hub&view=thread&thread=${eid}`;
    }

    function replaceChannel(match, id, offset, string) {
      let eid = encodeURIComponent(id);

      return `<a class="channel-link" href="?pkg=hub&view=channel&channel=${eid}`;
    }


    function replaceFeedID(match, id, offset, string) {
      let eid = encodeURIComponent(`@${id}`);
      return "<a class=\"profile-link\" href=\"?pkg=contacts&view=profile&feed=" + eid;
    }


    function replaceImageLinks(match, id, offset, string) {
      return `<a class="image-link" target="_blank" href="${patchfox.httpUrl("/blobs/get/&")}` + encodeURIComponent(id);
    }


    function replaceImages(match, id, offset, string) {
      return `<img class="is-image-from-blob" src="${patchfox.httpUrl("/blobs/get/&")}` + encodeURIComponent(id);
    }

    function replaceVideos(match, id, offset, string) {
      return `<video controls class="is-video-from-blob" src="${patchfox.httpUrl("/blobs/get/&")}` + encodeURIComponent(id);
    }

    function replaceAudios(match, id, offset, string) {
      return `<audio controls class="is-audio-from-blob" src="${patchfox.httpUrl("/blobs/get/&")}` + encodeURIComponent(id);
    }

    let opts = {
      toUrl: ref => {
        return ref
      }
    }
    let html = ssbMarkdown.block(text, opts)
    html = html
      .replace(/<pre>/gi, "<pre class=\"code\">")
      .replace(/<a href="#([^"]*)/gi, replaceChannel)
      .replace(/<a href="@([^"]*)/gi, replaceFeedID)
      .replace(/target="_blank"/gi, "")
      .replace(/<a href="%([^"]*)/gi, replaceMsgID)
      .replace(/<img src="&([^"]*)/gi, replaceImages)
      .replace(/<video controls src="&([^"]*)/gi, replaceVideos)
      .replace(/<audio controls src="&([^"]*)/gi, replaceAudios)
      .replace(/<a href="&([^"]*)/gi, replaceImageLinks)

    return html
  }

  getTimestamp(msg) {
    const arrivalTimestamp = msg.timestamp;
    const declaredTimestamp = msg.value.timestamp;
    return Math.min(arrivalTimestamp, declaredTimestamp);
  }

  getRootMsgId(msg) {
    if (msg && msg.value && msg.value.content) {
      const root = msg.value.content.root;
      if (ssbRef.isMsgId(root)) {
        return root;
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
        "contentWarning"
      ]

      commonFields.forEach(f => {
        if (typeof data[f] !== "undefined" && data[f] !== false && data[f].length > 0) {
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

      const commonFields = [
        "channel",
        "contentWarning",
        "thumbnail",
        "title",
        "summary"
      ]

      commonFields.forEach(f => {
        if (typeof data[f] !== "undefined" && data[f].length > 0 && data[f] !== false) {
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
              msgToPost.blog = hash;

              sbot.publish(msgToPost, function (err, msg) {
                if (err) {
                  reject(err)
                } else {
                  resolve(msg)
                }
              })
            }
          })
        );


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

  votes(msgid) {
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
        "type": "vote",
        "vote": {
          "link": msgid,
          "value": 1,
          "expression": "Like"
        }
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
        "type": "vote",
        "vote": {
          "link": msgid,
          "value": 0,
          "expression": "Unlike"
        }
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
              { "$filter": { "value": { "content": { "channel": { "$is": "string" }, "type": "post" } } } },
              {
                "$reduce": {
                  "channel": ["value", "content", "channel"],
                  "count": { "$count": true },
                  "timestamp": { "$max": ["value", "timestamp"] }
                }
              },
              { "$sort": [["timestamp"], ["count"]] }
            ],
            limit: 20
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
      const pipeline = pipelines.thread.get();

      let query = {
        "$filter": {
          value: {
            content: { channel }
          }
        },
        "$sort": [["value", "timestamp"]]

      }

      if (opts.lt) {
        query.$filter.value.timestamp = { $lt: opts.lt }
      }

      if (sbot) {
        pull(
          sbot.query.read({
            query: [
              query
            ],
            reverse: true
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
        "type": "channel",
        "channel": channel,
        "subscribed": true
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
        "type": "channel",
        "channel": channel,
        "subscribed": false
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
          "$filter": {
            value: {
              author: feed,
              content: {
                type: "channel",
                channel
              }
            }
          }
        }


        pull(
          sbot.query.read({
            query: [
              query
            ],
            reverse: true
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
          "$filter": {
            value: {
              author: feed,
              content: {
                type: "channel"
              }
            }
          },
          "$map": {
            channel: ["value", "content", "channel"],
            subscribed: ["value", "content", "subscribed"]
          },
          "$sort": [["value", "timestamp"]]
        }

        pull(
          sbot.query.read({
            query: [
              query
            ],
            reverse: true
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
        "type": "contact",
        "contact": feed,
        "following": true
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
        "type": "contact",
        "contact": feed,
        "following": false
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
        "type": "contact",
        "contact": feed,
        "blocking": true
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
        "type": "contact",
        "contact": feed,
        "blocking": false
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
          "$filter": {
            value: {
              author: byWhom,
              content: {
                type: "contact",
                contact: feed,
                following: { $is: "boolean" }
              }
            }
          }
        }


        pull(
          sbot.query.read({
            query: [
              query
            ],
            reverse: true
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
          "$filter": {
            value: {
              author: byWhom,
              content: {
                type: "contact",
                contact: feed,
                blocking: { $is: "boolean" }
              }
            }
          }
        }


        pull(
          sbot.query.read({
            query: [
              query
            ],
            reverse: true
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

        const pipeline = pipelines.thread.get();

        let query = {
          "$filter": filter
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
            query: [
              query
            ],
            reverse: reverse
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
          "$filter": {
            value: {
              author: source,
              content: {
                type: "contact"
              }
            }
          }
        }


        pull(
          sbot.query.read({
            query: [
              query
            ]
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

  async popular({ period }) {
    if (!sbot) {
      throw "error: no sbot"
    }

    const ssb = sbot;

    const periodDict = {
      day: 1,
      week: 7,
      month: 30.42,
      year: 365
    };

    if (period in periodDict === false) {
      throw new Error("invalid period");
    }

    const myFeedId = ssb.id;

    const now = new Date();
    const earliest = Number(now) - 1000 * 60 * 60 * 24 * periodDict[period];

    const source = ssb.query.read(
      configure({
        query: [
          {
            $filter: {
              value: {
                timestamp: { $gte: earliest },
                content: {
                  type: "vote"
                }
              },
              timestamp: { $gte: earliest }
            }
          }
        ],
        index: "DTA"
      })
    );
    const followingFilter = await socialFilter({ following: true });


    const messages = await new Promise((resolve, reject) => {
      pull(
        source,
        publicOnlyFilter,
        pull.filter(msg => {
          return (
            typeof msg.value.content === "object" &&
            typeof msg.value.content.vote === "object" &&
            typeof msg.value.content.vote.link === "string" &&
            typeof msg.value.content.vote.value === "number"
          );
        }),
        pull.reduce(
          (acc, cur) => {
            const author = cur.value.author;
            const target = cur.value.content.vote.link;
            const value = cur.value.content.vote.value;

            if (acc[author] == null) {
              acc[author] = {};
            }

            // Only accept values between -1 and 1
            acc[author][target] = Math.max(-1, Math.min(1, value));

            return acc;
          },
          {},
          (err, obj) => {
            if (err) {
              return reject(err);
            }

            // HACK: Can we do this without a reduce()? I think this makes the
            // stream much slower than it needs to be. Also, we should probably
            // be indexing these rather than building the stream on refresh.

            const adjustedObj = Object.entries(obj).reduce(
              (acc, [author, values]) => {
                if (author === myFeedId) {
                  return acc;
                }

                const entries = Object.entries(values);
                const total = 1 + Math.log(entries.length);

                entries.forEach(([link, value]) => {
                  if (acc[link] == null) {
                    acc[link] = 0;
                  }
                  acc[link] += value / total;
                });
                return acc;
              },
              []
            );

            const arr = Object.entries(adjustedObj);
            const length = arr.length;

            pull(
              pull.values(arr),
              pullSort(([, aVal], [, bVal]) => bVal - aVal),
              pull.take(Math.min(length, maxMessages)),
              pull.map(([key]) => key),
              pullParallelMap(async (key, cb) => {
                try {
                  const msg = await post.get(key);
                  cb(null, msg);
                } catch (e) {
                  cb(null, null);
                }
              }),
              pull.filter(
                (
                  message // avoid private messages (!)
                ) => message && typeof message.value.content !== "string"
              ),
              followingFilter,
              pull.collect((err, collectedMessages) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(transform(ssb, collectedMessages, myFeedId));
                }
              })
            );
          }
        )
      );
    });

    return messages;
  }

  /**
   * Returns a function that filters messages based on who published the message.
   *
   * `null` means we don't care, `true` means it must be true, and `false` means
   * that the value must be false. For example, if you set `me = true` then it
   * will only allow messages that are from you. If you set `blocking = true`
   * then you only see message from people you block.
   */
  async socialFilter ({
    following = null,
    blocking = false,
    me = null
  } = {}) {
    if (!sbot) {
      throw "error: no sbot"
    }

    const ssb = sbot;
    const { id } = ssb;
    const relationshipObject = await ssb.friends.get({
      source: id
    });

    const followingList = Object.entries(relationshipObject)
      .filter(([, val]) => val === true)
      .map(([key]) => key);

    const blockingList = Object.entries(relationshipObject)
      .filter(([, val]) => val === false)
      .map(([key]) => key);

    return pull.filter(message => {
      if (message.value.author === id) {
        return me !== false;
      } else {
        return (
          (following === null ||
            followingList.includes(message.value.author) === following) &&
          (blocking === null ||
            blockingList.includes(message.value.author) === blocking)
        );
      }
    });
  };
}

global.ssb = new SSB()
module.exports.SSB = SSB
