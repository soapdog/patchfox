const pull = require("pull-stream")
const { getVisibilityForMessageType } = require("../../kernel/prefs.js")

let getPref = () => {}
let isMessageHidden = () => {}
let relationshipGraph = {
  friends: [],
  following: []
}


function setSharedFunctionsForFilters({getPref: gp, isMessageHidden: ish}) {
  getPref = gp
  isMessageHidden = ish
}

function updateFriendsAndFollowing(friends, following) {
  relationshipGraph.friends = friends
  relationshipGraph.following = following
}

function filterHasContent() {
  return pull.filter((msg) => msg && msg.value && msg.value.content)
}

function filterRemovePrivateMsgs() {
  return pull.filter(
    (msg) => msg && msg.value && typeof msg.value.content !== "string"
  )
}

async function  filterBlocking() {
  return await this.socialFilter({ blocking: false })
}

function filterLimit() {
  let limit = getPref("limit", 20)
  return pull.take(Number(limit))
}

function filterWithUserFilters() {
  return pull.filter((m) => {
    let res = isMessageHidden(m)
    if (!res) {
      console.log(`msg ${m.key} has been filtered.`)
    }
    return res
  })
}

function filterTypes() {
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
    let author = msg.value.author

    let vis = getVisibilityForMessageType(type, "hide")

    // console.log(`${msg.key} ... ${type}: ${vis} ...`)
    if (vis === "hide") {
      return false
    }

    if (vis === "friends") {
      return relationshipGraph.friends.includes(author)
    }

    if (vis === "following") {
      return relationshipGraph.following.includes(author)
    }

    if (vis === "all") {
      return true
    }
  })
}

module.exports = {
  filterTypes,
  filterLimit,
  filterRemovePrivateMsgs,
  filterWithUserFilters,
  filterBlocking,
  filterHasContent,
  setSharedFunctionsForFilters,
  updateFriendsAndFollowing
}
