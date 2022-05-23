const m = require("mithril")
const AvatarChip = require("../../core/components/AvatarChip.js")
const VoteView = {
  oninit: (vnode) => {
    vnode.state.loadingBlurb = true
    vnode.state.loadingAvatar = true
    vnode.state.label = vnode.attrs.msg.value.content.vote.link
    vnode.state.person = vnode.attrs.msg.value.author
  },
  view: (vnode) => {
    let msg = vnode.attrs.msg

    let expression =
      msg.value.content.vote.expression === "Like"
        ? ":heart:"
        : msg.value.content.vote.expression
    let msgid = msg.value.content.vote.link
    let encodedid = encodeURIComponent(msgid)

    if (vnode.state.loadingBlurb) {
      ssb
        .blurbFromMsg(msgid, 50)
        .then((blurb) => {
          vnode.state.label = blurb
          vnode.state.loadingBlurb = false
          m.redraw()
        })
        .catch((n) => {
          console.log("error retrieving blurb for", msgid)
          console.error(n)
        })
    }

    if (vnode.state.loadingAvatar) {
      ssb.avatar(msg.value.author).then((data) => {
        if (data?.name) {
          vnode.state.person = data.name
          vnode.state.loadingAvatar = false
          m.redraw()
        } else {
          console.log("odd", data)
        }
      })
    }

    const goThread = (ev) => {
      ev.stopPropagation()
      ev.preventDefault()
      if (typeof msgid === "undefined") {
        throw "Can't go to undefined message id"
      }
      if (ev.ctrlKey) {
        window.open(`?pkg=hub&view=thread&thread=${encodeURIComponent(msgid)}`)
      } else {
        patchfox.go("hub", "thread", { thread: msgid })
      }
    }

    const avatarClick = (ev) => {
      let feed = ev.detail.feed
      patchfox.go("contacts", "profile", { feed })
    }

    return m("p.m-2", [
      m(AvatarChip, {
        inline: true,
        glyph: expression,
        feed: msg.value.author,
        onclick: avatarClick,
      }),
      m(
        "a",
        {
          href: `?pkg=hub&view=thread&thread=${encodedid}`,
          onclick: goThread,
        },
        vnode.state.label
      ),
    ])
  },
}

module.exports = VoteView
