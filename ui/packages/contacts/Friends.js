const m = require("mithril")
const QueryRepeater = require("../../core/components/QueryRepeater.js")
const AvatarChip = require("../../core/components/AvatarChip.js")
const AvatarListing = require("../../core/components/AvatarListing.js")
const Spinner = require("../../core/components/Spinner.js")
const { when } = require("../../core/kernel/utils.js")

const _ = require("lodash")

const FriendsView = {
  oninit: vnode => {
    let feed = vnode.attrs.feed
    let oncount = vnode.attrs.oncount

    vnode.state.contacts = []
    vnode.state.loading = true

    console.time("loading friends")

    ssb.friendship.friendsAsArray(feed).then(ids => {
      vnode.state.contacts = ids
      vnode.state.loading = false
      oncount({ friends: vnode.state.contacts.length })
      console.timeEnd("loading friends")
      m.redraw()
    })

    patchfox.listen("package:activate:contacts:profile", () => location.reload())
  },
  view: vnode => {
    let feed = vnode.attrs.feed

    return [m(AvatarListing, { feeds: vnode.state.contacts }), when(vnode.state.loading, m(Spinner))]
  },
}

module.exports = FriendsView
