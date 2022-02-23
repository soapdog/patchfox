const pull = require("pull-stream")
const paramap = require("pull-paramap")

const friendship = {
  followingAsArray: (feed) =>
    new Promise((resolve, reject) => {
      let filter = (content) => {
        return content.following === true
      }
      let callback = (err, ids) => {
        if (err) {
          reject(err)
        } else {
          resolve(ids)
        }
      }

      pull(
        ssb.sbot.links({
          source: feed,
          rel: "contact",
          values: true,
          reverse: true,
        }),
        pull.map(function (msg) {
          return msg && msg.value && msg.value.content
        }),
        pull.filter(function (content) {
          return content && content.type === "contact"
        }),
        pull.unique("contact"),
        pull.filter(filter),
        pull.map("contact"),
        pull.collect(callback)
      )
    }),
  followersAsArray: (feed) =>
    new Promise((resolve, reject) => {
      pull(
        ssb.sbot.links({
          dest: feed,
          rel: "contact",
          values: true,
          reverse: true,
        }),
        pull.map((msg) => msg && msg.value),
        pull.unique("author"),

        pull.filter(function (value) {
          return value.content && value.content.type === "contact"
        }),
        pull.filter(function (value) {
          return value.content.following === true
        }),
        pull.map("author"),
        pull.collect((err, ids) => {
          if (err) {
            reject(err)
          } else {
            resolve(ids)
          }
        })
      )
    }),
  friendsAsArray: (feed) =>
    new Promise((resolve, reject) => {
      pull(
        ssb.sbot.links({
          source: feed,
          rel: "contact",
          values: true,
          reverse: true,
        }),
        pull.map(function (msg) {
          return msg && msg.value && msg.value.content
        }),
        pull.filter(function (content) {
          return content && content.type === "contact"
        }),
        pull.unique("contact"),
        pull.filter(function (content) {
          return content.following === true
        }),
        paramap((content, cb) => {
          ssb.following(feed, content.contact).then((data) => {
            content.friend = data
            cb(null, content)
          })
        }),
        pull.filter((content) => content.friend),
        pull.map("contact"),
        pull.collect((err, ids) => {
          if (err) {
            reject(err)
          } else {
            resolve(ids)
          }
        })
      )
    }),
}

module.exports = friendship
