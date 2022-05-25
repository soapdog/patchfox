const m = require("mithril")
const QueryRepeater = require("../../core/components/QueryRepeater.js")
const AvatarChip = require("../../core/components/AvatarChip.js")
const AvatarContainer = require("../../core/components/AvatarContainer.js")
const Spinner = require("../../core/components/Spinner.js")

const _ = require("lodash")

const FollowingView = {
  oninit: (vnode) => {
    let feed = vnode.attrs.feed
    let oncount = vnode.attrs.oncount

    vnode.state.contacts = []
    vnode.state.loading = true

    console.time("loading following")

    ssb.friendship.followingAsArray(feed).then((ids) => {
      vnode.state.contacts = ids
      vnode.state.loading = false
      oncount({ following: contacts.length })
      console.timeEnd("loading following")
      m.redraw()
    })

    patchfox.listen("package:activate:contacts:profile", () =>
      location.reload()
    )
  },
  view: (vnode) => {
    let feed = vnode.attrs.feed

    const avatarClick = (ev) => {
      let feed = ev.detail.feed

      patchfox.go("contacts", "profile", { feed })
    }

    return [
      m(
        AvatarContainer,
        vnode.state.contacts.map((contact) =>
          m(AvatarChip, {
            feed: contact,
            onclick: avatarClick,
          })
        )
      ),
      when(vnode.state.loading, m(Spinner)),
    ]
  },
}

module.exports = FollowingView
