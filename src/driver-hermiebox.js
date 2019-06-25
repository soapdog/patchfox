/**
 * Hermiebox Driver
 *
 * TL;DR: SSB API for Patchfox using Hermiebox.
 *
 * OBJECTIVE:
 * The SSB is in flux right now. There are many approaches being played with which might
 * affect how this WebExtension connect to sbot. Some of the experiments being tried out are:
 *
 * - lessbot/nobot: each app maintain its own database and index but post through a shared sbot.
 * - graphql: export a GraphQL server which offers SSB features.
 * - json-rpc: export a JSON-RPC server offering SSB features.
 *
 * This driver folder will contain the various adapters to use these modes of connection as they
 * become available. For now, we'll use hermiebox.
 *
 * **Important: Each driver should export the exact same API to Patchfox**. This way we can
 * switch drivers without having to refactor the add-on.
 *
 * HOW IT WORKS:
 * Hermiebox is a browserified fat package of common NodeJS modules from our community and also
 * few highlevel API methods for common tasks. It uses WebSockets to connect to a running sbot
 * using muxrpc and shs stuff, so it needs your `secret` to be available.
 * 
 * ATTENTION:
 * This is a legacy from when Patchfox was vanilla JS. I'm gonna need to refactor this a lot
 * 
 * TODO: Refactor to use `ssb-query`
 */

export class DriverHermiebox {
  constructor() {
    this.name = "Driver for Hermiebox"
  }

  log(pMsg, pVal = "") {
    console.log(`[Driver Hermiebox] - ${pMsg}`, pVal)
  }

  async connect(pKeys) {
    var server = await hermiebox.api.connect(pKeys)
    this.log("you are", server.id)
    this.feed = server.id
  }

  async public(opts) {
    var msgs = await hermiebox.api.pullPublic(opts,{})
    return msgs
  }

  async thread(msgid) {
    var msgs = await hermiebox.api.thread(msgid)
    return msgs
  }

  async profile(feedid) {
    try {
      var user = await hermiebox.api.profile(feedid)
      return user

    } catch (n) {
      console.error(n)
      return false
    }
  }

  async get(msgid) {
    var msg = await hermiebox.api.get(msgid)
    return msg
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
    try {
      let avatar = await hermiebox.api.avatar(feed)
      await this.setAvatarCache(feed, avatar)
      return avatar
    } catch (n) {
      throw n
    }

  }

  async blurbFromMsg(msgid, howManyChars) {
    let retVal = msgid

    try {
      let data = await ssb.get(msgid)

      if (data.content.type == "post") {
        retVal = this.plainTextFromMarkdown(data.content.text.slice(0, howManyChars) + "...")
      }
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

    let html = hermiebox.modules.ssbMarkdown.block(text)
    html = html
      .replace("<pre>", "<pre class=\"code\">")
      .replace(/<a href="#([^"]*)/gi, replaceChannel)
      .replace(/<a href="@([^"]*)/gi, replaceFeedID)
      .replace(/target="_blank"/gi, "")
      .replace(/<a href="%([^"]*)/gi, replaceMsgID)
      .replace(/<img src="&([^"]*)/gi, replaceImages)
      .replace(/<a href="&([^"]*)/gi, replaceImageLinks)

    return html
  }

  ref() {
    return hermiebox.modules.ssbRef
  }

  getTimestamp(msg) {
    const arrivalTimestamp = msg.timestamp;
    const declaredTimestamp = msg.value.timestamp;
    return Math.min(arrivalTimestamp, declaredTimestamp);
  }

  getRootMsgId(msg) {
    if (msg && msg.value && msg.value.content) {
      const root = msg.value.content.root;
      if (hermiebox.modules.ssbRef.isMsgId(root)) {
        return root;
      }
    }
  }

  newPost(data) {
    return new Promise((resolve, reject) => {
      const schemas = hermiebox.modules.ssbMsgSchemas

      const text = data.text
      const root = data.hasOwnProperty("root") ? data.root : undefined
      const branch = data.hasOwnProperty("branch") ? data.branch : undefined
      const mentions = hermiebox.modules.ssbMentions(data.text)
      const recps = data.hasOwnProperty("recps") ? data.recps : undefined
      const channel = data.hasOwnProperty("channel") ? data.channel : undefined
      const fork = data.hasOwnProperty("fork") ? data.fork : undefined
      const sbot = hermiebox.sbot || false

      if (mentions.length == 0) {
        mentions = undefined
      }

      const msgToPost = schemas.post(text, root, branch, mentions, recps, channel)

      if (fork) {
        // TODO: ssb-msg-schemas doesn't have a fork param
        msgToPost.fork = fork
      }

      console.log("posting", msgToPost)

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

  follow(userId) {
    return new Promise((resolve, reject) => {
      const sbot = hermiebox.sbot || false

      if (sbot) {
        sbot.publish({
          type: "contact",
          contact: userId,
          following: true
        }, (err, msg) => {
          // 'msg' includes the hash-id and headers
          if (err) {
            reject(err)
          } else {
            resolve(msg)
          }
        })
      }
    })
  }


  getBlob(blobid) {
    return hermiebox.api.getBlob(blobid)
  }

  votes(msgid) {
    return new Promise((resolve, reject) => {
      let pull = hermiebox.modules.pullStream
      let sbot = hermiebox.sbot

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

      const sbot = hermiebox.sbot || false

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
      const sbot = hermiebox.sbot || false

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
      let pull = hermiebox.modules.pullStream
      let sbot = hermiebox.sbot || false

      if (sbot) {
        console.log("querying channels")
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
      let pull = hermiebox.modules.pullStream
      let sbot = hermiebox.sbot || false
      let query = {
        "$filter": {
          value: {
            content: { channel }
          }
        }
      }

      if (opts.lt) {
        query.$filter.value.timestamp = { $lt: opts.lt }
      }

      console.dir(query)

      if (sbot) {
        pull(
          sbot.query.read({
            query: [
              query
            ],
            limit: opts.limit,
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

  channelSubscribe(channel) {
    return new Promise((resolve, reject) => {
      const sbot = hermiebox.sbot || false

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
      const sbot = hermiebox.sbot || false

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
      let pull = hermiebox.modules.pullStream
      let sbot = hermiebox.sbot || false

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
      let pull = hermiebox.modules.pullStream
      let sbot = hermiebox.sbot || false

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
      const sbot = hermiebox.sbot || false

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
      const sbot = hermiebox.sbot || false

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
      const sbot = hermiebox.sbot || false

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
      const sbot = hermiebox.sbot || false

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
      let pull = hermiebox.modules.pullStream
      let sbot = hermiebox.sbot || false

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
      let pull = hermiebox.modules.pullStream
      let sbot = hermiebox.sbot || false

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

  query(filter, limit, reverse, map, reduce) {
    return new Promise((resolve, reject) => {
      let pull = hermiebox.modules.pullStream
      let sbot = hermiebox.sbot || false

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

        console.log(`query call with limit: ${limit} and reverse: ${reverse}`, query)
        pull(
          sbot.query.read({
            query: [
              query
            ],
            reverse: reverse,
            limit: limit
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
}
