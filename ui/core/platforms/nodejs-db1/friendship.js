const pull = require("pull-stream")
const paramap = require("pull-paramap")
const run = require("promisify-tuple")

let graph = {}

const friendship = {
  refreshRelationshipGraph: async () => {
    let [err, newGraph] = await run(ssb.sbot.friends.graph)()

    if (err) {
      throw err
    }

    graph = newGraph
  }, followingAsArray: async (feed) => {
    if (!graph.hasOwnProperty(feed)) {
      await friendship.refreshRelationshipGraph()
    }

    let feedGraph = graph[feed]
    let arr = []

    Object.keys(feedGraph).forEach(k => {
      if (feedGraph[k] === 1) {
        arr.push(k)
      }
    })

    return arr
  }, followersAsArray: async (feed) => {
    if (!graph.hasOwnProperty(feed)) {
      await friendship.refreshRelationshipGraph()
    }

    let arr = []

    Object.keys(graph).forEach(k => {
      let thisFeedGraph = graph[k]

      if (thisFeedGraph[feed] === 1) {
        // they follow feed.
        arr.push(k)
      }
    })

    return arr
  }, friendsAsArray: async (feed) => {
    let following = await friendship.followingAsArray(feed)
    let followers = await friendship.followersAsArray(feed)

    return following.filter(x => followers.includes(x))
  }
}

module.exports = friendship
