const pull = require("pull-stream")

let getPref = () => {}
let isMessageHidden = () => {}

function setSharedFunctionsForFilters({getPref: gp, isMessageHidden: ish}) {
  getPref = gp
  isMessageHidden = ish
}

function filterHasContent() {
  return pull.filter((msg) => msg && msg.value && msg.value.content)
}

function filterRemovePrivateMsgs() {
  return pull.filter(
    (msg) => msg && msg.value && typeof msg.value.content !== "string"
  )
}

async function  filterFollowing() {
  return await this.socialFilter({ following: true })
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

    if (typeof type == "string" && knownMessageTypes[type]) {
      return getPref(knownMessageTypes[type], true)
    }
    return getPref("showTypeUnknown", false)
  })
}

module.exports = {
  filterTypes,
  filterLimit,
  filterRemovePrivateMsgs,
  filterWithUserFilters,
  filterFollowing,
  filterHasContent,
  setSharedFunctionsForFilters
}
