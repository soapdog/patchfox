/*

File adapted from Perihelion by Nicolas Santini.
 
Perihelion is an awesome SSB client, get its source from:

https://github.com/nsantini/perihelion

MIT License

Copyright (c) 2022 Nicolas Santini

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
const serverForIdentity = require("../../sbot.js")
const profile = require("./entities/profile")
const feed = require("./entities/feed")
const post = require("./entities/post")
const peers = require("./entities/peers")
const blob = require("./entities/blob")
const thread = require("./entities/thread")
const invites = require("./entities/invites")
const privateThreads = require("./entities/private")
const votes = require("./entities/votes")

module.exports = {
  getProfile: async (identity, id) => {
    try {
      const ssb = serverForIdentity(identity)
      return profile.getProfile(ssb, id === "self" ? ssb.id : id)
    } catch (err) {
      console.error("getProfile", err)
      throw err
    }
  },

  filterProfiles: async (identity, name) => {
    try {
      const ssb = serverForIdentity(identity)
      return profile.filterProfiles(ssb, name)
    } catch (err) {
      console.error("filterProfiles", err)
      throw err
    }
  },

  updateProfile: async (identity, updates) => {
    try {
      const ssb = serverForIdentity(identity)
      return profile.updateProfile(ssb, updates)
    } catch (err) {
      console.error("getProfile", err)
      throw err
    }
  },

  getThreads: async (identity, hops, page) => {
    try {
      const ssb = serverForIdentity(identity)
      return feed.getPublicFeed(ssb, hops, page)
    } catch (err) {
      console.error("getThreads", err)
      throw err
    }
  },

  getProfileThreads: async (identity, feedId, page) => {
    try {
      const ssb = serverForIdentity(identity)
      return feed.getProfileFeed(ssb, feedId === "self" ? ssb.id : feedId, page)
    } catch (err) {
      console.error("getProfileThreads", err)
      throw err
    }
  },

  postMessage: async (identity, message) => {
    try {
      const ssb = serverForIdentity(identity)
      return await post(ssb, message)
    } catch (err) {
      console.error("postMessage", err)
      throw err
    }
  },

  getConnectedPeers: async identity => {
    try {
      const ssb = serverForIdentity(identity)
      return peers.getConnectedPeers(ssb)
    } catch (err) {
      console.error("getConnectedPeers", err)
      throw err
    }
  },

  getBlob: async (identity, blobId) => {
    try {
      const ssb = serverForIdentity(identity)
      return blob.getBlob(ssb, blobId)
    } catch (err) {
      console.error("getBlob", err)
      throw err
    }
  },

  uploadBlob: async (identity, file) => {
    try {
      const ssb = serverForIdentity(identity)
      return blob.uploadBlob(ssb, file)
    } catch (err) {
      console.error("uploadBlob", err)
      throw err
    }
  },

  getThread: async (identity, msgId, isPrivate) => {
    try {
      const ssb = serverForIdentity(identity)
      return thread(ssb, msgId, isPrivate)
    } catch (err) {
      console.error("getThread", err)
      throw err
    }
  },

  updateFollow: async (identity, feedId, currentState) => {
    try {
      const ssb = serverForIdentity(identity)
      return peers.updateFollow(ssb, feedId, currentState)
    } catch (err) {
      console.error("updateFollow", err)
      throw err
    }
  },

  updateBlock: async (identity, feedId, currentState) => {
    try {
      const ssb = serverForIdentity(identity)
      return peers.updateBlock(ssb, feedId, currentState)
    } catch (err) {
      console.error("updateBlock", err)
      throw err
    }
  },

  claimInvite: async (identity, invite) => {
    try {
      const ssb = serverForIdentity(identity)
      return invites(ssb, invite)
    } catch (err) {
      console.error("claimInvite", err)
      throw err
    }
  },

  getPrivateFeed: async identity => {
    try {
      const ssb = serverForIdentity(identity)
      return privateThreads.getPrivateFeed(ssb)
    } catch (err) {
      console.error("getPrivateFeed", err)
      throw err
    }
  },

  vote: async (identity, msgId) => {
    try {
      const ssb = serverForIdentity(identity)
      return votes.vote(ssb, msgId)
    } catch (err) {
      console.error("vote", err)
      throw err
    }
  },
}
