/**
 * SSB
 *
 * Things I don't currently like here:
 * - usage of getPref and abuse prevention. This should be pluggable?
 */


const {getPref, savedKeys} = require("../../kernel/prefs.js")
const {isMessageHidden} = require("./abusePrevention.js")

const pull = require("pull-stream")
const sort = require("ssb-sort")
const ssbMarkdown = require("ssb-markdown")
const ssbRef = require("ssb-ref")
const ssbMentions = require("ssb-mentions")
const ssbClient = require("ssb-client")
const ssbAvatar = require("ssb-avatar")

const manifest = require("./manifest")

let sbot = false

let avatarCache = {}
let msgCache = {}

class SSB {
  log(pMsg, pVal = "") {
    console.log(`[SSB API] - ${pMsg}`, pVal)
  }

  connect(keys) {
    let port = 8989;

    if (!keys) {
      keys = savedKeys()
    }
    return new Promise(function (resolve, reject) {
      if (sbot) {
        resolve(sbot)
      } else {
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
            sbot = server
            console.log("you are", server.id)
            resolve(server)
          }
        })
      }
    })
  }

  filterLimit() {
    let limit = getPref("limit", 10)
    return pull.take(limit)
  }

  filterWithUserFilters() {
    return pull.filter(m => isMessageHidden(m))
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

      console.log("opts", opts)

      pull(
        sbot.createFeedStream(opts),
        pull.filter(msg => msg && msg.value && msg.value.content),
        this.filterTypes(),
        this.filterWithUserFilters(),
        this.filterLimit(),
        pull.collect((err, msgs) => {
          console.log("msgs", msgs)
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
      sbot.get(id, (err, value) => {
        if (err) return cb(err)
        var rootMsg = {key: id, value: value}
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
            sbot.links({dest: id, values: true, rel: 'root'}),
            pull.filter(function (msg) {
              var c = msg && msg.value && msg.value.content
              return c && c.type === 'post' && c.root === id
            }),
            pull.unique('key')
          ),
          this.filterTypes(),
          this.filterWithUserFilters(),
          this.filterLimit(),
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
      const createBacklinkStream = id => {
        var filterQuery = {
          $filter: {
            dest: id
          }
        };

        if (lt) {
          filterQuery.$filter.value = {timestamp: {$lt: lt}};
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
        this.filterTypes(),
        this.filterWithUserFilters(),
        this.filterLimit(),
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
      let q = query.toLowerCase();
      let limit = parseInt(getPref("limit", 10))
      pull(
        pull(sbot => sbot.search.query({q, limit})),
        this.filterTypes(),
        this.filterWithUserFilters(),
        this.filterLimit(),
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
    const opts = {reverse: true, live: true, private: true}

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
            this.filterTypes(),
            this.filterWithUserFilters(),
            this.filterLimit(),
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
        reverse: true,
        limit: getPref("limit", 10)
      }

      let user = {
        msgs: [],
        about: await this.aboutMessages(feedid, feedid)
      }

      pull(
        sbot.createUserStream(opts),
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

  get(msgid) {
    return new Promise((resolve, reject) => {
      if (sbot.ooo) {
        sbot.get({id: id, raw: true, ooo: false, private: true}, (err, data) => {
          if (err) reject(err)
          resolve(data)
        })
      } else {
        if (!sbot.private) {
          // if no sbot.private, assume we have newer sbot that supports private:true
          return sbot.get({id: id, private: true}, (err, data) => {
            if (err) reject(err)
            resolve(data)
          })
        }
        sbot.get(id, (err, data) => {
          if (err) reject(err)
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
    let allSavedData = {...localStorage}
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

    try {
      if (msgCache[msgid]) {
        return msgCache[msgid]
      }
      let data = await ssb.get(msgid)

      if (data.content.type == "post") {
        retVal = this.plainTextFromMarkdown(data.content.text.slice(0, howManyChars) + "...")
      }
      msgCache[msgid] = retVal
      return retVal
    } catch (n) {
      return retVal
    }
  }

  plainTextFromMarkdown(text) {
    // TODO: this doesn't belong here
    let html = this.markdown(text)
    let div = document.createElement("div")
    div.innerHTML = html
    return div.innerText
  }

  markdown(text) {

    function replaceMsgID(match, id, offset, string) {
      let eid = encodeURIComponent(`%${id}`);

      return `<a class="thread-link" href="?thread=${eid}#/thread`;
    }

    function replaceChannel(match, id, offset, string) {
      let eid = encodeURIComponent(id);

      return `<a class="channel-link" href="?channel=${eid}#/channel`;
    }


    function replaceFeedID(match, id, offset, string) {
      let eid = encodeURIComponent(`@${id}`);
      return "<a class=\"profile-link\" href=\"?feed=" + eid + "#/profile";
    }


    function replaceImageLinks(match, id, offset, string) {
      return "<a class=\"image-link\" target=\"_blank\" href=\"http://localhost:8989/blobs/get/&" + encodeURIComponent(id);
    }


    function replaceImages(match, id, offset, string) {
      return "<img class=\"is-image-from-blob\" src=\"http://localhost:8989/blobs/get/&" + encodeURIComponent(id);
    }

    function replaceVideos(match, id, offset, string) {
      return "<video controls class=\"is-video-from-blob\" src=\"http://localhost:8989/blobs/get/&" + encodeURIComponent(id);
    }

    function replaceAudios(match, id, offset, string) {
      return "<audio controls class=\"is-audio-from-blob\" src=\"http://localhost:8989/blobs/get/&" + encodeURIComponent(id);
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

  newPost(data) {
    return new Promise((resolve, reject) => {
      let msgToPost = {type: "post", text: data.text}

      const commonFields = [
        "root",
        "branch",
        "channel",
        "fork",
        "contentWarning"
      ]

      commonFields.forEach(f => {
        if (typeof data[f] !== "undefined") {
          msgToPost[f] = data[f]
        }
      })

      msgToPost.mentions = ssbMentions(msgToPost.text) || []

      if (msgToPost.contentWarning && msgToPost.contentWarning.length > 0) {
        let moreMentions = ssbMentions(msgToPost.contentWarning)
        msgToPost.mentions = msgToPost.mentions.concat(moreMentions)
      }

      msgToPost.mentions = msgToPost.mentions.filter(n => n) // prevent null elements...

      console.log("post", msgToPost)

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
      let msgToPost = {type: "blog"}
      let blogContent = data.content

      const commonFields = [
        "channel",
        "contentWarning",
        "thumbnail",
        "title",
        "summary"
      ]

      commonFields.forEach(f => {
        if (typeof data[f] !== "undefined" && data[f].length > 0) {
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

              console.log("blog post", msgToPost)

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
          sbot.links({dest: msgid, rel: "vote", values: true}),
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
        console.log("querying channels")
        pull(
          sbot.query.read({
            query: [
              {"$filter": {"value": {"content": {"channel": {"$is": "string"}, "type": "post"}}}},
              {
                "$reduce": {
                  "channel": ["value", "content", "channel"],
                  "count": {"$count": true},
                  "timestamp": {"$max": ["value", "timestamp"]}
                }
              },
              {"$sort": [["timestamp"], ["count"]]}
            ],
            limit: 20
          }),
          pull.collect(function (err, data) {
            console.log("channels", data)
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

      let query = {
        "$filter": {
          value: {
            content: {channel}
          }
        },
        "$sort": [["value", "timestamp"]]

      }

      if (opts.lt) {
        query.$filter.value.timestamp = {$lt: opts.lt}
      }

      if (sbot) {
        pull(
          sbot.query.read({
            query: [
              query
            ],
            reverse: true
          }),
          this.filterTypes(),
          this.filterWithUserFilters(),
          this.filterLimit(),
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
                following: {$is: "boolean"}
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
                blocking: {$is: "boolean"}
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
          this.filterTypes(),
          this.filterLimit(),
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
}

module.exports.SSB = SSB
