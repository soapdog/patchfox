const paramap = require("pull-paramap");
const pull = require("pull-stream");
const _ = require("lodash");
const kernel = require("../kernel/kernel.js")
const browser = require("webextension-polyfill");


let friends = []

const connectSSB = async () => {
  try {
    let savedData = await kernel.loadConfiguration()
    // window.ssb.* comes from browserified ssb.js
    // that exists only in the dist folder.
    let server = await ssb.connect(kernel.savedKeys(), savedData.remote)
    window.ssb.feed = server.id
    window.ssb.sbot = server
    ssb.setGetPrefFunction(kernel.getPref)
    ssb.setIsMessageHiddenFunction(isMessageHidden)
    await ssb.loadCaches()
    return server.id
  } catch (n) {
    console.error(`can't connect to sbot`, n)
  }
}

const computeFriendsCache = () => {
  const sbot = ssb.sbot

  pull(
    sbot.links({
      source: feed,
      rel: "contact",
      values: true,
      reverse: true
    }),
    pull.map(function (msg) {
      return msg && msg.value && msg.value.content;
    }),
    pull.filter(function (content) {
      return content && content.type === "contact";
    }),
    pull.unique("contact"),
    pull.filter(function (content) {
      return content.following === true;
    }),
    paramap((content, cb) => {
      ssb.following(feed, content.contact)
        .then(data => {
          content.friend = data
          cb(null, content)
        })

    }),
    pull.filter(content => content.friend),
    pull.map("contact"),
    pull.drain((id) => {
      friends.push(id)
    })
  );
}

module.exports = {
  friends,
  computeFriendsCache,
  connectSSB
}
